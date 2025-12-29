/**
 * gRPC Server Reflection client
 * Implements grpc.reflection.v1.ServerReflection to discover services
 */

import { createGrpcClient } from './client';
import type {
  GrpcEnumType,
  GrpcField,
  GrpcFieldType,
  GrpcMessageType,
  GrpcMethod,
  GrpcService,
  ReflectionResponse,
} from './types';

// Proto field type constants (from google.protobuf.FieldDescriptorProto.Type)
const PROTO_FIELD_TYPES: Record<number, GrpcFieldType> = {
  1: 'double',
  2: 'float',
  3: 'int64',
  4: 'uint64',
  5: 'int32',
  6: 'fixed64',
  7: 'fixed32',
  8: 'bool',
  9: 'string',
  10: 'message', // GROUP (deprecated, treat as message)
  11: 'message',
  12: 'bytes',
  13: 'uint32',
  14: 'enum',
  15: 'sfixed32',
  16: 'sfixed64',
  17: 'sint32',
  18: 'sint64',
};

// Proto field label constants
const LABEL_OPTIONAL = 1;
const LABEL_REPEATED = 3;

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

interface ServerReflectionRequest {
  host?: string;
  listServices?: string;
  fileContainingSymbol?: string;
  fileByFilename?: string;
}

interface ServerReflectionResponse {
  listServicesResponse?: {
    service?: Array<{ name?: string }>;
  };
  fileDescriptorResponse?: {
    fileDescriptorProto?: string[];
  };
  errorResponse?: {
    errorCode?: number;
    errorMessage?: string;
  };
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
    const response = await client.unaryCall<ServerReflectionRequest, ServerReflectionResponse>(
      '/grpc.reflection.v1.ServerReflection/ServerReflectionInfo',
      { listServices: '' },
    );

    if (response.status.code !== 0) {
      // Try v1alpha endpoint as fallback
      const alphaResponse = await client.unaryCall<
        ServerReflectionRequest,
        ServerReflectionResponse
      >('/grpc.reflection.v1alpha.ServerReflection/ServerReflectionInfo', { listServices: '' });

      if (alphaResponse.status.code !== 0) {
        throw new Error(`Reflection error: ${response.status.message}`);
      }

      return (
        alphaResponse.message.listServicesResponse?.service?.map((s) => s.name || '').filter(Boolean) ||
        []
      );
    }

    return (
      response.message.listServicesResponse?.service?.map((s) => s.name || '').filter(Boolean) || []
    );
  }

  /**
   * Get file descriptor for a service/symbol
   */
  async function getFileDescriptor(symbol: string): Promise<FileDescriptorProto[]> {
    const response = await client.unaryCall<ServerReflectionRequest, ServerReflectionResponse>(
      '/grpc.reflection.v1.ServerReflection/ServerReflectionInfo',
      { fileContainingSymbol: symbol },
    );

    if (response.status.code !== 0) {
      // Try v1alpha endpoint as fallback
      const alphaResponse = await client.unaryCall<
        ServerReflectionRequest,
        ServerReflectionResponse
      >('/grpc.reflection.v1alpha.ServerReflection/ServerReflectionInfo', {
        fileContainingSymbol: symbol,
      });

      if (alphaResponse.status.code !== 0) {
        throw new Error(`Reflection error: ${response.status.message}`);
      }

      return parseFileDescriptors(alphaResponse.message.fileDescriptorResponse?.fileDescriptorProto);
    }

    return parseFileDescriptors(response.message.fileDescriptorResponse?.fileDescriptorProto);
  }

  /**
   * Parse base64-encoded file descriptor protos
   */
  function parseFileDescriptors(encoded?: string[]): FileDescriptorProto[] {
    if (!encoded || encoded.length === 0) {
      return [];
    }

    // Note: In a real implementation, we would use @bufbuild/protobuf to decode
    // For now, we'll work with JSON-encoded descriptors from gRPC-Web
    return encoded.map((data) => {
      try {
        // Try to parse as JSON first (some gRPC-Web implementations send JSON)
        return JSON.parse(atob(data)) as FileDescriptorProto;
      } catch {
        // If not JSON, it's binary protobuf - return empty for now
        // Full implementation would use @bufbuild/protobuf
        return {} as FileDescriptorProto;
      }
    });
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
          if (processedFiles.has(fileName)) continue;
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
      if (nested.options?.mapEntry) continue;

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
  let typeName = field.typeName?.replace(/^\./, '');

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
  if (value === undefined) return undefined;

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
      return parseInt(value, 10);
    case 'float':
    case 'double':
      return parseFloat(value);
    default:
      return value;
  }
}
