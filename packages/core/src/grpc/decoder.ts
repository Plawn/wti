/**
 * Dynamic protobuf decoder based on reflection schema
 * Decodes protobuf binary to JSON objects
 */

import type { GrpcEnumType, GrpcField, GrpcMessageType } from './types';

// Wire types
const WIRE_VARINT = 0;
const WIRE_FIXED64 = 1;
const WIRE_LENGTH_DELIMITED = 2;
const WIRE_FIXED32 = 5;

/**
 * Decode a varint from buffer, returns [value, newOffset]
 */
function decodeVarint(buffer: Uint8Array, startOffset: number): [bigint, number] {
  let value = 0n;
  let shift = 0n;
  let offset = startOffset;

  while (offset < buffer.length) {
    const byte = buffer[offset++];
    value |= BigInt(byte & 0x7f) << shift;
    shift += 7n;
    if (!(byte & 0x80)) {
      break;
    }
  }

  return [value, offset];
}

/**
 * Decode a signed varint (zigzag decoding)
 */
function decodeSignedVarint(buffer: Uint8Array, startOffset: number): [bigint, number] {
  const [zigzag, offset] = decodeVarint(buffer, startOffset);
  // Zigzag decoding: (n >>> 1) ^ -(n & 1)
  const value = (zigzag >> 1n) ^ -(zigzag & 1n);
  return [value, offset];
}

/**
 * Decode a 32-bit fixed value (little-endian)
 */
function decodeFixed32(buffer: Uint8Array, offset: number): number {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4);
  return view.getUint32(0, true);
}

/**
 * Decode a signed 32-bit fixed value (little-endian)
 */
function decodeSfixed32(buffer: Uint8Array, offset: number): number {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4);
  return view.getInt32(0, true);
}

/**
 * Decode a 64-bit fixed value (little-endian)
 */
function decodeFixed64(buffer: Uint8Array, offset: number): bigint {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 8);
  return view.getBigUint64(0, true);
}

/**
 * Decode a signed 64-bit fixed value (little-endian)
 */
function decodeSfixed64(buffer: Uint8Array, offset: number): bigint {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 8);
  return view.getBigInt64(0, true);
}

/**
 * Decode a float (32-bit)
 */
function decodeFloat(buffer: Uint8Array, offset: number): number {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4);
  return view.getFloat32(0, true);
}

/**
 * Decode a double (64-bit)
 */
function decodeDouble(buffer: Uint8Array, offset: number): number {
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 8);
  return view.getFloat64(0, true);
}

/**
 * Parse raw protobuf fields from binary
 */
function parseRawFields(
  buffer: Uint8Array,
  start: number,
  end: number,
): Map<number, { wireType: number; values: { data: Uint8Array; offset: number }[] }> {
  const fields = new Map<
    number,
    { wireType: number; values: { data: Uint8Array; offset: number }[] }
  >();
  let offset = start;

  while (offset < end) {
    const [tag, newOffset] = decodeVarint(buffer, offset);
    offset = newOffset;

    const fieldNumber = Number(tag >> 3n);
    const wireType = Number(tag & 0x7n);

    let data: Uint8Array;
    let dataOffset = offset;

    switch (wireType) {
      case WIRE_VARINT: {
        const startOff = offset;
        while (offset < end && buffer[offset] & 0x80) {
          offset++;
        }
        offset++;
        data = buffer.slice(startOff, offset);
        break;
      }
      case WIRE_FIXED64: {
        data = buffer.slice(offset, offset + 8);
        offset += 8;
        break;
      }
      case WIRE_LENGTH_DELIMITED: {
        const [len, lenOffset] = decodeVarint(buffer, offset);
        offset = lenOffset;
        dataOffset = offset;
        data = buffer.slice(offset, offset + Number(len));
        offset += Number(len);
        break;
      }
      case WIRE_FIXED32: {
        data = buffer.slice(offset, offset + 4);
        offset += 4;
        break;
      }
      default:
        throw new Error(`Unknown wire type: ${wireType}`);
    }

    if (!fields.has(fieldNumber)) {
      fields.set(fieldNumber, { wireType, values: [] });
    }
    fields.get(fieldNumber)?.values.push({ data, offset: dataOffset });
  }

  return fields;
}

/**
 * Decode a field value based on its type
 */
function decodeFieldValue(
  data: Uint8Array,
  _dataOffset: number,
  _wireType: number,
  field: GrpcField,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): unknown {
  switch (field.type) {
    case 'double':
      return decodeDouble(data, 0);

    case 'float':
      return decodeFloat(data, 0);

    case 'int32': {
      const [val] = decodeVarint(data, 0);
      // Convert to signed 32-bit
      return Number(BigInt.asIntN(32, val));
    }

    case 'int64': {
      const [val] = decodeVarint(data, 0);
      const signed = BigInt.asIntN(64, val);
      // Return as string if it's too large for safe integer
      if (signed > BigInt(Number.MAX_SAFE_INTEGER) || signed < BigInt(Number.MIN_SAFE_INTEGER)) {
        return signed.toString();
      }
      return Number(signed);
    }

    case 'uint32': {
      const [val] = decodeVarint(data, 0);
      return Number(val & 0xffffffffn);
    }

    case 'uint64': {
      const [val] = decodeVarint(data, 0);
      if (val > BigInt(Number.MAX_SAFE_INTEGER)) {
        return val.toString();
      }
      return Number(val);
    }

    case 'sint32': {
      const [val] = decodeSignedVarint(data, 0);
      return Number(val);
    }

    case 'sint64': {
      const [val] = decodeSignedVarint(data, 0);
      if (val > BigInt(Number.MAX_SAFE_INTEGER) || val < BigInt(Number.MIN_SAFE_INTEGER)) {
        return val.toString();
      }
      return Number(val);
    }

    case 'fixed32':
      return decodeFixed32(data, 0);

    case 'fixed64': {
      const val = decodeFixed64(data, 0);
      if (val > BigInt(Number.MAX_SAFE_INTEGER)) {
        return val.toString();
      }
      return Number(val);
    }

    case 'sfixed32':
      return decodeSfixed32(data, 0);

    case 'sfixed64': {
      const val = decodeSfixed64(data, 0);
      if (val > BigInt(Number.MAX_SAFE_INTEGER) || val < BigInt(Number.MIN_SAFE_INTEGER)) {
        return val.toString();
      }
      return Number(val);
    }

    case 'bool': {
      const [val] = decodeVarint(data, 0);
      return val !== 0n;
    }

    case 'string':
      return new TextDecoder().decode(data);

    case 'bytes':
      // Return as base64
      return bytesToBase64(data);

    case 'enum': {
      const [val] = decodeVarint(data, 0);
      const enumValue = Number(val);
      // Try to get enum name
      if (field.typeName) {
        const enumType = enumTypes.get(field.typeName);
        if (enumType) {
          const enumVal = enumType.values.find((v) => v.number === enumValue);
          if (enumVal) {
            return enumVal.name;
          }
        }
      }
      return enumValue;
    }

    case 'message': {
      if (!field.typeName) {
        return {};
      }
      const messageType = messageTypes.get(field.typeName);
      if (!messageType) {
        return {};
      }
      return decodeMessage(data, messageType, messageTypes, enumTypes);
    }

    default:
      return null;
  }
}

/**
 * Convert bytes to base64
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decode a message from protobuf binary
 */
export function decodeMessage(
  buffer: Uint8Array,
  messageType: GrpcMessageType,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const rawFields = parseRawFields(buffer, 0, buffer.length);

  // Build field number to field map
  const fieldMap = new Map<number, GrpcField>();
  for (const field of messageType.fields) {
    fieldMap.set(field.number, field);
  }

  // Decode each field
  for (const [fieldNumber, { wireType, values }] of rawFields) {
    const field = fieldMap.get(fieldNumber);
    if (!field) {
      // Unknown field, skip
      continue;
    }

    if (field.repeated) {
      // Repeated field - collect all values
      const arr: unknown[] = [];
      for (const { data, offset } of values) {
        const decoded = decodeFieldValue(data, offset, wireType, field, messageTypes, enumTypes);
        arr.push(decoded);
      }
      result[field.name] = arr;
    } else {
      // Single value - use last one (protobuf behavior)
      const lastValue = values[values.length - 1];
      result[field.name] = decodeFieldValue(
        lastValue.data,
        lastValue.offset,
        wireType,
        field,
        messageTypes,
        enumTypes,
      );
    }
  }

  return result;
}

/**
 * Create a decoder function for a specific message type
 */
export function createMessageDecoder(
  messageType: GrpcMessageType,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): (buffer: Uint8Array) => Record<string, unknown> {
  return (buffer) => decodeMessage(buffer, messageType, messageTypes, enumTypes);
}
