/**
 * Convert gRPC service definitions to unified ApiSpec format
 */

import type { ApiSpec, Operation, Schema, Server, Tag } from '../types';
import type {
  GrpcEnumType,
  GrpcField,
  GrpcMessageType,
  GrpcMethod,
  GrpcService,
  ReflectionResponse,
} from './types';

export interface ConvertOptions {
  /** Server URL for the gRPC endpoint */
  serverUrl: string;
  /** API title */
  title?: string;
  /** API version */
  version?: string;
  /** API description */
  description?: string;
}

/**
 * Convert gRPC reflection response to ApiSpec
 */
export function convertGrpcToSpec(
  reflection: ReflectionResponse,
  options: ConvertOptions,
): ApiSpec {
  const { services, messageTypes, enumTypes } = reflection;
  const { serverUrl, title, version, description } = options;

  // Build schemas from message types
  const schemas: Record<string, Schema> = {};
  for (const [name, msgType] of messageTypes) {
    schemas[name] = messageTypeToSchema(msgType, messageTypes, enumTypes);
  }

  // Add enum schemas
  for (const [name, enumType] of enumTypes) {
    schemas[name] = enumTypeToSchema(enumType);
  }

  // Build operations from services
  const operations: Operation[] = [];
  const tags: Tag[] = [];

  for (const service of services) {
    // Add service as a tag
    tags.push({
      name: service.name,
      description: `gRPC service: ${service.name}`,
    });

    // Add each method as an operation
    for (const method of service.methods) {
      operations.push(methodToOperation(method, service, messageTypes, enumTypes));
    }
  }

  // Build server
  const servers: Server[] = [
    {
      url: serverUrl,
      description: 'gRPC server',
    },
  ];

  return {
    type: 'grpc',
    info: {
      title: title || extractServiceTitle(services),
      version: version || '1.0.0',
      description: description || `gRPC API with ${services.length} services`,
    },
    servers,
    tags,
    operations,
    schemas,
    securitySchemes: {},
  };
}

/**
 * Extract a title from service names
 */
function extractServiceTitle(services: GrpcService[]): string {
  if (services.length === 0) return 'gRPC API';
  if (services.length === 1) return services[0].name;

  // Find common package prefix
  const names = services.map((s) => s.name);
  const parts = names[0].split('.');

  for (let i = 0; i < parts.length - 1; i++) {
    const prefix = parts.slice(0, i + 1).join('.');
    if (names.every((n) => n.startsWith(`${prefix}.`))) {
      return prefix;
    }
  }

  return 'gRPC API';
}

/**
 * Convert a gRPC method to an Operation
 */
function methodToOperation(
  method: GrpcMethod,
  service: GrpcService,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): Operation {
  // Get input message type for parameters
  const inputType = messageTypes.get(method.inputType);
  const outputType = messageTypes.get(method.outputType);

  // Build request body schema from input type
  const requestSchema = inputType
    ? messageTypeToSchema(inputType, messageTypes, enumTypes)
    : { type: 'object' as const };

  // Build response schema from output type
  const responseSchema = outputType
    ? messageTypeToSchema(outputType, messageTypes, enumTypes)
    : { type: 'object' as const };

  // Determine streaming badge for summary
  let streamingInfo = '';
  if (method.clientStreaming && method.serverStreaming) {
    streamingInfo = ' (bidirectional streaming)';
  } else if (method.clientStreaming) {
    streamingInfo = ' (client streaming)';
  } else if (method.serverStreaming) {
    streamingInfo = ' (server streaming)';
  }

  return {
    id: `${service.name}.${method.name}`,
    method: 'GRPC',
    path: method.fullPath,
    summary: `${method.name}${streamingInfo}`,
    description: method.description || `gRPC method: ${method.name}`,
    tags: [service.name],
    deprecated: false,
    parameters: [],
    requestBody: {
      description: `Request message: ${method.inputType}`,
      required: true,
      content: {
        'application/json': {
          schema: requestSchema,
        },
      },
    },
    responses: [
      {
        statusCode: '0',
        description: `Success response: ${method.outputType}`,
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    ],
  };
}

/**
 * Convert a message type to a JSON Schema
 */
function messageTypeToSchema(
  msgType: GrpcMessageType,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): Schema {
  const properties: Record<string, Schema> = {};
  const required: string[] = [];

  for (const field of msgType.fields) {
    properties[field.name] = fieldToSchema(field, messageTypes, enumTypes);

    if (!field.optional && !field.repeated) {
      required.push(field.name);
    }
  }

  return {
    type: 'object',
    title: msgType.name.split('.').pop(),
    description: msgType.description,
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

/**
 * Convert a field to a JSON Schema
 */
function fieldToSchema(
  field: GrpcField,
  messageTypes: Map<string, GrpcMessageType>,
  enumTypes: Map<string, GrpcEnumType>,
): Schema {
  let schema: Schema;

  if (field.isMap && field.mapKeyType && field.mapValueType) {
    // Map type -> additionalProperties
    schema = {
      type: 'object',
      additionalProperties: primitiveTypeToSchema(field.mapValueType),
    };
  } else if (field.type === 'message' && field.typeName) {
    // Reference to message type
    const refType = messageTypes.get(field.typeName);
    if (refType) {
      schema = messageTypeToSchema(refType, messageTypes, enumTypes);
    } else {
      schema = { type: 'object', title: field.typeName };
    }
  } else if (field.type === 'enum' && field.typeName) {
    // Reference to enum type
    const enumType = enumTypes.get(field.typeName);
    if (enumType) {
      schema = enumTypeToSchema(enumType);
    } else {
      schema = { type: 'string', title: field.typeName };
    }
  } else {
    // Primitive type
    schema = primitiveTypeToSchema(field.type);
  }

  // Wrap in array if repeated
  if (field.repeated && !field.isMap) {
    schema = {
      type: 'array',
      items: schema,
    };
  }

  // Add description and default
  if (field.description) {
    schema.description = field.description;
  }

  if (field.defaultValue !== undefined) {
    schema.default = field.defaultValue;
  }

  return schema;
}

/**
 * Convert a primitive gRPC type to JSON Schema
 */
function primitiveTypeToSchema(type: string): Schema {
  switch (type) {
    case 'double':
    case 'float':
      return { type: 'number', format: type };

    case 'int32':
    case 'sint32':
    case 'sfixed32':
      return { type: 'integer', format: 'int32' };

    case 'int64':
    case 'sint64':
    case 'sfixed64':
      return { type: 'integer', format: 'int64' };

    case 'uint32':
    case 'fixed32':
      return { type: 'integer', format: 'int32', minimum: 0 };

    case 'uint64':
    case 'fixed64':
      return { type: 'integer', format: 'int64', minimum: 0 };

    case 'bool':
      return { type: 'boolean' };

    case 'string':
      return { type: 'string' };

    case 'bytes':
      return { type: 'string', format: 'byte' };

    default:
      return { type: 'string' };
  }
}

/**
 * Convert an enum type to JSON Schema
 */
function enumTypeToSchema(enumType: GrpcEnumType): Schema {
  return {
    type: 'string',
    title: enumType.name,
    description: enumType.description,
    enum: enumType.values.map((v) => v.name),
  };
}
