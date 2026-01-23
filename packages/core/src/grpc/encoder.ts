/**
 * Dynamic protobuf encoder based on reflection schema
 * Encodes JSON objects to protobuf binary format
 */

import { WIRE_FIXED32, WIRE_FIXED64, WIRE_LENGTH_DELIMITED, WIRE_VARINT } from './constants';
import type { GrpcEnumType, GrpcField, GrpcMessageType } from './types';

/**
 * Encode a varint (variable-length integer)
 */
function encodeVarint(val: number | bigint): Uint8Array {
  const bytes: number[] = [];
  let value = typeof val === 'bigint' ? val : BigInt(val);
  if (value < 0n) {
    // Negative numbers use two's complement (10 bytes for 64-bit)
    value = BigInt.asUintN(64, value);
  }
  do {
    let byte = Number(value & 0x7fn);
    value >>= 7n;
    if (value > 0n) {
      byte |= 0x80;
    }
    bytes.push(byte);
  } while (value > 0n);
  return new Uint8Array(bytes.length === 0 ? [0] : bytes);
}

/**
 * Encode a signed varint (zigzag encoding for sint32/sint64)
 */
function encodeSignedVarint(val: number | bigint): Uint8Array {
  const value = typeof val === 'bigint' ? val : BigInt(val);
  // Zigzag encoding: (n << 1) ^ (n >> 63)
  const zigzag = (value << 1n) ^ (value >> 63n);
  return encodeVarint(zigzag);
}

/**
 * Encode a 32-bit fixed value (little-endian)
 */
function encodeFixed32(val: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, val >>> 0, true); // Little-endian
  return new Uint8Array(buffer);
}

/**
 * Encode a 64-bit fixed value (little-endian)
 */
function encodeFixed64(val: number | bigint): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  const bigVal = typeof val === 'bigint' ? val : BigInt(val);
  view.setBigUint64(0, bigVal, true); // Little-endian
  return new Uint8Array(buffer);
}

/**
 * Encode a float (32-bit)
 */
function encodeFloat(val: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, val, true); // Little-endian
  return new Uint8Array(buffer);
}

/**
 * Encode a double (64-bit)
 */
function encodeDouble(val: number): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, val, true); // Little-endian
  return new Uint8Array(buffer);
}

/**
 * Encode a field tag (field number + wire type)
 */
function encodeTag(fieldNumber: number, wireType: number): Uint8Array {
  return encodeVarint((fieldNumber << 3) | wireType);
}

/**
 * Concatenate multiple Uint8Arrays
 */
function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Get wire type for a field type
 */
function getWireType(type: string): number {
  switch (type) {
    case 'double':
    case 'fixed64':
    case 'sfixed64':
      return WIRE_FIXED64;
    case 'float':
    case 'fixed32':
    case 'sfixed32':
      return WIRE_FIXED32;
    case 'int32':
    case 'int64':
    case 'uint32':
    case 'uint64':
    case 'sint32':
    case 'sint64':
    case 'bool':
    case 'enum':
      return WIRE_VARINT;
    case 'string':
    case 'bytes':
    case 'message':
      return WIRE_LENGTH_DELIMITED;
    default:
      return WIRE_LENGTH_DELIMITED;
  }
}

/**
 * Encode a single field value
 */
function encodeFieldValue(
  value: unknown,
  field: GrpcField,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): Uint8Array {
  if (value === null || value === undefined) {
    return new Uint8Array();
  }

  const wireType = getWireType(field.type);
  const tag = encodeTag(field.number, wireType);

  switch (field.type) {
    case 'double':
      return concat(tag, encodeDouble(Number(value)));

    case 'float':
      return concat(tag, encodeFloat(Number(value)));

    case 'int32':
    case 'int64':
    case 'uint32':
    case 'uint64':
      return concat(tag, encodeVarint(toNumberOrBigint(value)));

    case 'sint32':
    case 'sint64':
      return concat(tag, encodeSignedVarint(toNumberOrBigint(value)));

    case 'fixed32':
      return concat(tag, encodeFixed32(Number(value)));

    case 'fixed64':
      return concat(tag, encodeFixed64(toNumberOrBigint(value)));

    case 'sfixed32': {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setInt32(0, Number(value), true);
      return concat(tag, new Uint8Array(buffer));
    }

    case 'sfixed64': {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setBigInt64(0, BigInt(value as number | string), true);
      return concat(tag, new Uint8Array(buffer));
    }

    case 'bool':
      return concat(tag, encodeVarint(value ? 1 : 0));

    case 'string': {
      const strBytes = new TextEncoder().encode(String(value));
      return concat(tag, encodeVarint(strBytes.length), strBytes);
    }

    case 'bytes': {
      let bytes: Uint8Array;
      if (typeof value === 'string') {
        // Assume base64 encoded
        bytes = base64ToBytes(value);
      } else if (value instanceof Uint8Array) {
        bytes = value;
      } else {
        bytes = new Uint8Array();
      }
      return concat(tag, encodeVarint(bytes.length), bytes);
    }

    case 'enum': {
      // Enum can be number or string name
      let enumValue = 0;
      if (typeof value === 'number') {
        enumValue = value;
      } else if (typeof value === 'string' && field.typeName) {
        const enumType = enumTypes.get(field.typeName);
        if (enumType) {
          const enumVal = enumType.values.find((v) => v.name === value);
          if (enumVal) {
            enumValue = enumVal.number;
          }
        }
      }
      return concat(tag, encodeVarint(enumValue));
    }

    case 'message': {
      if (!field.typeName) {
        return new Uint8Array();
      }
      const messageType = messageTypes.get(field.typeName);
      if (!messageType) {
        return new Uint8Array();
      }
      const encoded = encodeMessage(
        value as Record<string, unknown>,
        messageType,
        messageTypes,
        enumTypes,
      );
      return concat(tag, encodeVarint(encoded.length), encoded);
    }

    default:
      return new Uint8Array();
  }
}

/**
 * Convert value to number or bigint
 */
function toNumberOrBigint(value: unknown): number | bigint {
  if (typeof value === 'bigint') {
    return value;
  }
  if (typeof value === 'string') {
    // Check if it's a large number that needs bigint
    const num = Number(value);
    if (!Number.isSafeInteger(num) && value.length > 0) {
      return BigInt(value);
    }
    return num;
  }
  return Number(value);
}

/**
 * Decode base64 to bytes
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encode a message object to protobuf binary
 */
export function encodeMessage(
  obj: Record<string, unknown>,
  messageType: GrpcMessageType,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): Uint8Array {
  const parts: Uint8Array[] = [];

  for (const field of messageType.fields) {
    const value = obj[field.name];

    if (value === null || value === undefined) {
      continue;
    }

    if (field.repeated && Array.isArray(value)) {
      // Repeated field - encode each value
      for (const item of value) {
        const encoded = encodeFieldValue(item, field, messageTypes, enumTypes);
        if (encoded.length > 0) {
          parts.push(encoded);
        }
      }
    } else {
      const encoded = encodeFieldValue(value, field, messageTypes, enumTypes);
      if (encoded.length > 0) {
        parts.push(encoded);
      }
    }
  }

  return concat(...parts);
}

/**
 * Create an encoder function for a specific message type
 */
export function createMessageEncoder(
  messageType: GrpcMessageType,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): (obj: Record<string, unknown>) => Uint8Array {
  return (obj) => encodeMessage(obj, messageType, messageTypes, enumTypes);
}
