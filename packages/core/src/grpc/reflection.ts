/**
 * gRPC Server Reflection client
 * Implements grpc.reflection.v1.ServerReflection to discover services
 * Uses proper protobuf binary encoding
 */

import { createGrpcClient } from './client';
import {
  LABEL_OPTIONAL,
  LABEL_REPEATED,
  PROTO_FIELD_TYPES,
  WIRE_FIXED32,
  WIRE_FIXED64,
  WIRE_LENGTH_DELIMITED,
  WIRE_VARINT,
} from './constants';
import {
  type GrpcEnumType,
  GrpcError,
  type GrpcField,
  type GrpcFieldType,
  type GrpcMessageType,
  type GrpcMethod,
  type GrpcService,
  GrpcStatusCode,
  type ReflectionResponse,
} from './types';

/**
 * Encode a varint (variable-length integer)
 */
function encodeVarint(val: number): Uint8Array {
  const bytes: number[] = [];
  let value = val;
  while (value > 127) {
    bytes.push((value & 0x7f) | 0x80);
    value >>>= 7;
  }
  bytes.push(value);
  return new Uint8Array(bytes);
}

/**
 * Decode a varint from buffer at offset, returns [value, newOffset]
 */
function decodeVarint(buffer: Uint8Array, startOffset: number): [number, number] {
  let value = 0;
  let shift = 0;
  let offset = startOffset;
  let byte: number;
  do {
    byte = buffer[offset++];
    value |= (byte & 0x7f) << shift;
    shift += 7;
  } while (byte & 0x80);
  return [value >>> 0, offset];
}

/**
 * Encode a string field
 */
function encodeStringField(fieldNumber: number, value: string): Uint8Array {
  const tag = encodeVarint((fieldNumber << 3) | WIRE_LENGTH_DELIMITED);
  const strBytes = new TextEncoder().encode(value);
  const len = encodeVarint(strBytes.length);
  const result = new Uint8Array(tag.length + len.length + strBytes.length);
  result.set(tag, 0);
  result.set(len, tag.length);
  result.set(strBytes, tag.length + len.length);
  return result;
}

/**
 * Encode a ServerReflectionRequest message
 * Field 1: host (string)
 * Field 4: file_containing_symbol (string) - for getting file descriptor
 * Field 7: list_services (string) - for listing services
 */
function encodeServerReflectionRequest(request: {
  host?: string;
  listServices?: string;
  fileContainingSymbol?: string;
}): Uint8Array {
  const parts: Uint8Array[] = [];

  if (request.host) {
    parts.push(encodeStringField(1, request.host));
  }
  if (request.fileContainingSymbol) {
    parts.push(encodeStringField(4, request.fileContainingSymbol));
  }
  if (request.listServices !== undefined) {
    parts.push(encodeStringField(7, request.listServices));
  }

  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

interface FileDescriptorProto {
  name?: string;
  package?: string;
  dependency?: string[];
  messageType?: DescriptorProto[];
  enumType?: EnumDescriptorProto[];
  service?: ServiceDescriptorProto[];
  sourceCodeInfo?: SourceCodeInfo;
}

interface DescriptorProto {
  name?: string;
  field?: FieldDescriptorProto[];
  nestedType?: DescriptorProto[];
  enumType?: EnumDescriptorProto[];
  options?: MessageOptions;
}

interface FieldDescriptorProto {
  name?: string;
  number?: number;
  label?: number;
  type?: number;
  typeName?: string;
  defaultValue?: string;
  options?: FieldOptions;
}

interface FieldOptions {
  deprecated?: boolean;
}

interface MessageOptions {
  mapEntry?: boolean;
}

interface EnumDescriptorProto {
  name?: string;
  value?: EnumValueDescriptorProto[];
}

interface EnumValueDescriptorProto {
  name?: string;
  number?: number;
}

interface ServiceDescriptorProto {
  name?: string;
  method?: MethodDescriptorProto[];
}

interface MethodDescriptorProto {
  name?: string;
  inputType?: string;
  outputType?: string;
  clientStreaming?: boolean;
  serverStreaming?: boolean;
}

interface SourceCodeInfo {
  location?: SourceCodeLocation[];
}

interface SourceCodeLocation {
  path?: number[];
  leadingComments?: string;
  trailingComments?: string;
}

/**
 * Decode a protobuf message into field map
 */
function decodeProtobufMessage(
  buffer: Uint8Array,
  start: number,
  end: number,
): Map<number, { wireType: number; values: Uint8Array[] }> {
  const fields = new Map<number, { wireType: number; values: Uint8Array[] }>();
  let offset = start;

  while (offset < end) {
    const [tag, newOffset] = decodeVarint(buffer, offset);
    offset = newOffset;

    const fieldNumber = tag >>> 3;
    const wireType = tag & 0x7;

    let value: Uint8Array;

    switch (wireType) {
      case WIRE_VARINT: {
        const startOffset = offset;
        while (buffer[offset] & 0x80) {
          offset++;
        }
        offset++;
        value = buffer.slice(startOffset, offset);
        break;
      }
      case WIRE_FIXED64: {
        value = buffer.slice(offset, offset + 8);
        offset += 8;
        break;
      }
      case WIRE_LENGTH_DELIMITED: {
        const [len, lenOffset] = decodeVarint(buffer, offset);
        offset = lenOffset;
        value = buffer.slice(offset, offset + len);
        offset += len;
        break;
      }
      case WIRE_FIXED32: {
        value = buffer.slice(offset, offset + 4);
        offset += 4;
        break;
      }
      default:
        throw new Error(`Unknown wire type: ${wireType}`);
    }

    if (!fields.has(fieldNumber)) {
      fields.set(fieldNumber, { wireType, values: [] });
    }
    fields.get(fieldNumber)?.values.push(value);
  }

  return fields;
}

/**
 * Decode a string from length-delimited bytes
 */
function decodeString(data: Uint8Array | undefined): string {
  if (!data) {
    return '';
  }
  return new TextDecoder().decode(data);
}

/**
 * Decode a varint from bytes
 */
function decodeVarintFromBytes(data: Uint8Array | undefined): number {
  if (!data) {
    return 0;
  }
  let value = 0;
  let shift = 0;
  for (const byte of data) {
    value |= (byte & 0x7f) << shift;
    shift += 7;
    if (!(byte & 0x80)) {
      break;
    }
  }
  return value >>> 0;
}

/**
 * Decode a boolean from varint bytes
 */
function decodeBool(data: Uint8Array | undefined): boolean {
  if (!data) {
    return false;
  }
  return decodeVarintFromBytes(data) !== 0;
}

/**
 * Helper to get field values safely
 */
function getFieldValues(
  fields: Map<number, { wireType: number; values: Uint8Array[] }>,
  fieldNumber: number,
): Uint8Array[] {
  return fields.get(fieldNumber)?.values ?? [];
}

/**
 * Helper to get first field value safely
 */
function getFirstFieldValue(
  fields: Map<number, { wireType: number; values: Uint8Array[] }>,
  fieldNumber: number,
): Uint8Array | undefined {
  return fields.get(fieldNumber)?.values[0];
}

/**
 * Parse FileDescriptorProto from binary protobuf
 */
function parseFileDescriptorProto(data: Uint8Array): FileDescriptorProto {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: FileDescriptorProto = {};

  // Field 1: name (string)
  if (fields.has(1)) {
    result.name = decodeString(getFirstFieldValue(fields, 1));
  }

  // Field 2: package (string)
  if (fields.has(2)) {
    result.package = decodeString(getFirstFieldValue(fields, 2));
  }

  // Field 3: dependency (repeated string)
  if (fields.has(3)) {
    result.dependency = getFieldValues(fields, 3).map(decodeString);
  }

  // Field 4: message_type (repeated DescriptorProto)
  if (fields.has(4)) {
    result.messageType = getFieldValues(fields, 4).map((v) => parseDescriptorProto(v));
  }

  // Field 5: enum_type (repeated EnumDescriptorProto)
  if (fields.has(5)) {
    result.enumType = getFieldValues(fields, 5).map((v) => parseEnumDescriptorProto(v));
  }

  // Field 6: service (repeated ServiceDescriptorProto)
  if (fields.has(6)) {
    result.service = getFieldValues(fields, 6).map((v) => parseServiceDescriptorProto(v));
  }

  return result;
}

/**
 * Parse DescriptorProto (message type) from binary
 */
function parseDescriptorProto(data: Uint8Array): DescriptorProto {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: DescriptorProto = {};

  // Field 1: name
  if (fields.has(1)) {
    result.name = decodeString(getFirstFieldValue(fields, 1));
  }

  // Field 2: field (repeated FieldDescriptorProto)
  if (fields.has(2)) {
    result.field = getFieldValues(fields, 2).map((v) => parseFieldDescriptorProto(v));
  }

  // Field 3: nested_type (repeated DescriptorProto)
  if (fields.has(3)) {
    result.nestedType = getFieldValues(fields, 3).map((v) => parseDescriptorProto(v));
  }

  // Field 4: enum_type (repeated EnumDescriptorProto)
  if (fields.has(4)) {
    result.enumType = getFieldValues(fields, 4).map((v) => parseEnumDescriptorProto(v));
  }

  // Field 7: options (MessageOptions)
  if (fields.has(7)) {
    const optData = getFirstFieldValue(fields, 7);
    if (optData) {
      result.options = parseMessageOptions(optData);
    }
  }

  return result;
}

/**
 * Parse FieldDescriptorProto from binary
 */
function parseFieldDescriptorProto(data: Uint8Array): FieldDescriptorProto {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: FieldDescriptorProto = {};

  // Field 1: name
  if (fields.has(1)) {
    result.name = decodeString(getFirstFieldValue(fields, 1));
  }

  // Field 3: number
  if (fields.has(3)) {
    result.number = decodeVarintFromBytes(getFirstFieldValue(fields, 3));
  }

  // Field 4: label
  if (fields.has(4)) {
    result.label = decodeVarintFromBytes(getFirstFieldValue(fields, 4));
  }

  // Field 5: type
  if (fields.has(5)) {
    result.type = decodeVarintFromBytes(getFirstFieldValue(fields, 5));
  }

  // Field 6: type_name
  if (fields.has(6)) {
    result.typeName = decodeString(getFirstFieldValue(fields, 6));
  }

  // Field 7: default_value
  if (fields.has(7)) {
    result.defaultValue = decodeString(getFirstFieldValue(fields, 7));
  }

  return result;
}

/**
 * Parse MessageOptions from binary
 */
function parseMessageOptions(data: Uint8Array): MessageOptions {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: MessageOptions = {};

  // Field 7: map_entry
  if (fields.has(7)) {
    result.mapEntry = decodeBool(getFirstFieldValue(fields, 7));
  }

  return result;
}

/**
 * Parse EnumDescriptorProto from binary
 */
function parseEnumDescriptorProto(data: Uint8Array): EnumDescriptorProto {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: EnumDescriptorProto = {};

  // Field 1: name
  if (fields.has(1)) {
    result.name = decodeString(getFirstFieldValue(fields, 1));
  }

  // Field 2: value (repeated EnumValueDescriptorProto)
  if (fields.has(2)) {
    result.value = getFieldValues(fields, 2).map((v) => {
      const vFields = decodeProtobufMessage(v, 0, v.length);
      return {
        name: vFields.has(1) ? decodeString(getFirstFieldValue(vFields, 1)) : undefined,
        number: vFields.has(2) ? decodeVarintFromBytes(getFirstFieldValue(vFields, 2)) : undefined,
      };
    });
  }

  return result;
}

/**
 * Parse ServiceDescriptorProto from binary
 */
function parseServiceDescriptorProto(data: Uint8Array): ServiceDescriptorProto {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: ServiceDescriptorProto = {};

  // Field 1: name
  if (fields.has(1)) {
    result.name = decodeString(getFirstFieldValue(fields, 1));
  }

  // Field 2: method (repeated MethodDescriptorProto)
  if (fields.has(2)) {
    result.method = getFieldValues(fields, 2).map((v) => parseMethodDescriptorProto(v));
  }

  return result;
}

/**
 * Parse MethodDescriptorProto from binary
 */
function parseMethodDescriptorProto(data: Uint8Array): MethodDescriptorProto {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: MethodDescriptorProto = {};

  // Field 1: name
  if (fields.has(1)) {
    result.name = decodeString(getFirstFieldValue(fields, 1));
  }

  // Field 2: input_type
  if (fields.has(2)) {
    result.inputType = decodeString(getFirstFieldValue(fields, 2));
  }

  // Field 3: output_type
  if (fields.has(3)) {
    result.outputType = decodeString(getFirstFieldValue(fields, 3));
  }

  // Field 5: client_streaming
  if (fields.has(5)) {
    result.clientStreaming = decodeBool(getFirstFieldValue(fields, 5));
  }

  // Field 6: server_streaming
  if (fields.has(6)) {
    result.serverStreaming = decodeBool(getFirstFieldValue(fields, 6));
  }

  return result;
}

/**
 * Parse ServerReflectionResponse from binary protobuf
 */
function parseServerReflectionResponse(data: Uint8Array): {
  listServicesResponse?: { service?: Array<{ name?: string }> };
  fileDescriptorResponse?: { fileDescriptorProto?: Uint8Array[] };
  errorResponse?: { errorCode?: number; errorMessage?: string };
} {
  const fields = decodeProtobufMessage(data, 0, data.length);
  const result: {
    listServicesResponse?: { service?: Array<{ name?: string }> };
    fileDescriptorResponse?: { fileDescriptorProto?: Uint8Array[] };
    errorResponse?: { errorCode?: number; errorMessage?: string };
  } = {};

  // Field 6: list_services_response
  const listData = getFirstFieldValue(fields, 6);
  if (listData) {
    const listFields = decodeProtobufMessage(listData, 0, listData.length);
    result.listServicesResponse = {
      service: listFields.has(1)
        ? getFieldValues(listFields, 1).map((v) => {
            const svcFields = decodeProtobufMessage(v, 0, v.length);
            return {
              name: svcFields.has(1) ? decodeString(getFirstFieldValue(svcFields, 1)) : undefined,
            };
          })
        : [],
    };
  }

  // Field 4: file_descriptor_response
  const fdData = getFirstFieldValue(fields, 4);
  if (fdData) {
    const fdFields = decodeProtobufMessage(fdData, 0, fdData.length);
    result.fileDescriptorResponse = {
      fileDescriptorProto: fdFields.has(1) ? getFieldValues(fdFields, 1) : [],
    };
  }

  // Field 7: error_response
  const errData = getFirstFieldValue(fields, 7);
  if (errData) {
    const errFields = decodeProtobufMessage(errData, 0, errData.length);
    result.errorResponse = {
      errorCode: errFields.has(1)
        ? decodeVarintFromBytes(getFirstFieldValue(errFields, 1))
        : undefined,
      errorMessage: errFields.has(2) ? decodeString(getFirstFieldValue(errFields, 2)) : undefined,
    };
  }

  return result;
}

/**
 * Create a gRPC reflection client to discover services
 */
export function createReflectionClient(baseUrl: string) {
  const client = createGrpcClient({ baseUrl });

  /**
   * List all available services on the server
   */
  async function listServices(): Promise<string[]> {
    const requestData = encodeServerReflectionRequest({ listServices: '' });

    // Try v1 endpoint first
    let result = await client.unaryCallRaw(
      '/grpc.reflection.v1.ServerReflection/ServerReflectionInfo',
      requestData,
    );

    if (result.status.code !== 0) {
      // Try v1alpha endpoint as fallback
      result = await client.unaryCallRaw(
        '/grpc.reflection.v1alpha.ServerReflection/ServerReflectionInfo',
        requestData,
      );

      if (result.status.code !== 0) {
        throw new GrpcError(
          `Reflection error: ${result.status.message}`,
          result.status.code as GrpcStatusCode,
        );
      }
    }

    const response = parseServerReflectionResponse(result.data);

    if (response.errorResponse) {
      throw new GrpcError(
        response.errorResponse.errorMessage || 'Reflection error',
        (response.errorResponse.errorCode as GrpcStatusCode) || GrpcStatusCode.UNKNOWN,
        `Error code: ${response.errorResponse.errorCode}`,
      );
    }

    return response.listServicesResponse?.service?.map((s) => s.name || '').filter(Boolean) || [];
  }

  /**
   * Get file descriptor for a service/symbol
   */
  async function getFileDescriptor(symbol: string): Promise<FileDescriptorProto[]> {
    const requestData = encodeServerReflectionRequest({ fileContainingSymbol: symbol });

    // Try v1 endpoint first
    let result = await client.unaryCallRaw(
      '/grpc.reflection.v1.ServerReflection/ServerReflectionInfo',
      requestData,
    );

    if (result.status.code !== 0) {
      // Try v1alpha endpoint as fallback
      result = await client.unaryCallRaw(
        '/grpc.reflection.v1alpha.ServerReflection/ServerReflectionInfo',
        requestData,
      );

      if (result.status.code !== 0) {
        throw new GrpcError(
          `Reflection error: ${result.status.message}`,
          result.status.code as GrpcStatusCode,
        );
      }
    }

    const response = parseServerReflectionResponse(result.data);

    if (response.errorResponse) {
      throw new GrpcError(
        response.errorResponse.errorMessage || 'Reflection error',
        (response.errorResponse.errorCode as GrpcStatusCode) || GrpcStatusCode.UNKNOWN,
        `Error code: ${response.errorResponse.errorCode}`,
      );
    }

    const descriptors = response.fileDescriptorResponse?.fileDescriptorProto || [];
    return descriptors.map((data) => parseFileDescriptorProto(data));
  }

  /**
   * Discover all services, methods, and types from the server
   */
  async function discoverServices(): Promise<ReflectionResponse> {
    const serviceNames = await listServices();
    const services: GrpcService[] = [];
    const messageTypes = new Map<string, GrpcMessageType>();
    const enumTypes = new Map<string, GrpcEnumType>();

    // Get file descriptors for each service
    const processedFiles = new Set<string>();

    for (const serviceName of serviceNames) {
      // Skip reflection service itself
      if (serviceName.startsWith('grpc.reflection.')) {
        continue;
      }

      try {
        const fileDescriptors = await getFileDescriptor(serviceName);

        for (const fd of fileDescriptors) {
          const fileName = fd.name || '';
          if (processedFiles.has(fileName)) {
            continue;
          }
          processedFiles.add(fileName);

          const packageName = fd.package || '';

          // Process message types
          if (fd.messageType) {
            for (const msg of fd.messageType) {
              const fullName = packageName ? `${packageName}.${msg.name}` : msg.name || '';
              const parsed = parseMessageType(msg, packageName, fd.sourceCodeInfo);
              messageTypes.set(fullName, parsed);

              // Process nested types
              processNestedTypes(msg, fullName, messageTypes, enumTypes, fd.sourceCodeInfo);
            }
          }

          // Process enum types
          if (fd.enumType) {
            for (const enumDef of fd.enumType) {
              const fullName = packageName ? `${packageName}.${enumDef.name}` : enumDef.name || '';
              enumTypes.set(fullName, parseEnumType(enumDef));
            }
          }

          // Process services
          if (fd.service) {
            for (const svc of fd.service) {
              const fullServiceName = packageName ? `${packageName}.${svc.name}` : svc.name || '';

              if (fullServiceName === serviceName) {
                services.push({
                  name: fullServiceName,
                  methods: (svc.method || []).map((m) => parseMethod(m, fullServiceName)),
                });
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to get descriptor for ${serviceName}:`, error);
      }
    }

    return { services, messageTypes, enumTypes };
  }

  return {
    listServices,
    getFileDescriptor,
    discoverServices,
    close: () => client.close(),
  };
}

export type ReflectionClient = ReturnType<typeof createReflectionClient>;

/**
 * Parse a message type from descriptor
 */
function parseMessageType(
  msg: DescriptorProto,
  packageName: string,
  sourceInfo?: SourceCodeInfo,
): GrpcMessageType {
  const fullName = packageName ? `${packageName}.${msg.name}` : msg.name || '';

  return {
    name: fullName,
    fields: (msg.field || []).map((f) => parseField(f, packageName)),
    nestedTypes: msg.nestedType
      ?.filter((nt) => !nt.options?.mapEntry)
      .map((nt) => parseMessageType(nt, fullName, sourceInfo)),
    enumTypes: msg.enumType?.map((e) => parseEnumType(e)),
  };
}

/**
 * Process nested types recursively
 */
function processNestedTypes(
  msg: DescriptorProto,
  parentName: string,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
  sourceInfo?: SourceCodeInfo,
): void {
  if (msg.nestedType) {
    for (const nested of msg.nestedType) {
      // Skip map entry types
      if (nested.options?.mapEntry) {
        continue;
      }

      const fullName = `${parentName}.${nested.name}`;
      messageTypes.set(fullName, parseMessageType(nested, parentName, sourceInfo));
      processNestedTypes(nested, fullName, messageTypes, enumTypes, sourceInfo);
    }
  }

  if (msg.enumType) {
    for (const enumDef of msg.enumType) {
      const fullName = `${parentName}.${enumDef.name}`;
      enumTypes.set(fullName, parseEnumType(enumDef));
    }
  }
}

/**
 * Parse a field from descriptor
 */
function parseField(field: FieldDescriptorProto, _packageName: string): GrpcField {
  const type = PROTO_FIELD_TYPES[field.type || 0] || 'message';
  const repeated = field.label === LABEL_REPEATED;

  // Clean up type name (remove leading dot)
  const typeName = field.typeName?.replace(/^\./, '');

  return {
    name: field.name || '',
    number: field.number || 0,
    type,
    typeName,
    repeated,
    optional: field.label === LABEL_OPTIONAL,
    isMap: false, // Would need to check for map entry pattern
    defaultValue: parseDefaultValue(field.defaultValue, type),
  };
}

/**
 * Parse an enum type from descriptor
 */
function parseEnumType(enumDef: EnumDescriptorProto): GrpcEnumType {
  return {
    name: enumDef.name || '',
    values: (enumDef.value || []).map((v) => ({
      name: v.name || '',
      number: v.number || 0,
    })),
  };
}

/**
 * Parse a method from descriptor
 */
function parseMethod(method: MethodDescriptorProto, serviceName: string): GrpcMethod {
  // Clean up type names (remove leading dot)
  const inputType = method.inputType?.replace(/^\./, '') || '';
  const outputType = method.outputType?.replace(/^\./, '') || '';

  return {
    name: method.name || '',
    fullPath: `/${serviceName}/${method.name}`,
    inputType,
    outputType,
    clientStreaming: method.clientStreaming || false,
    serverStreaming: method.serverStreaming || false,
  };
}

/**
 * Parse default value string
 */
function parseDefaultValue(value: string | undefined, type: GrpcFieldType): unknown {
  if (value === undefined) {
    return undefined;
  }

  switch (type) {
    case 'bool':
      return value === 'true';
    case 'int32':
    case 'int64':
    case 'uint32':
    case 'uint64':
    case 'sint32':
    case 'sint64':
    case 'fixed32':
    case 'fixed64':
    case 'sfixed32':
    case 'sfixed64':
      return Number.parseInt(value, 10);
    case 'float':
    case 'double':
      return Number.parseFloat(value);
    default:
      return value;
  }
}
