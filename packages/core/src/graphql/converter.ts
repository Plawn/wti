/**
 * Convert GraphQL schema to unified ApiSpec
 */

import type { ApiSpec, Operation, Parameter, RequestBody, Response, Schema, Tag } from '../types';
import type { GraphqlField, GraphqlType, GraphqlTypeRef, IntrospectionResult } from './types';

export interface ConvertOptions {
  endpoint: string;
  title?: string;
  version?: string;
  description?: string;
}

export function convertGraphqlToSpec(
  introspection: IntrospectionResult,
  options: ConvertOptions,
): ApiSpec {
  const { schema, types } = introspection;
  const { endpoint, title, version, description } = options;

  const operations: Operation[] = [];
  const tags: Tag[] = [];
  const schemas: Record<string, Schema> = {};

  // Convert Query fields to operations
  if (schema.queryType?.name) {
    const queryType = types.get(schema.queryType.name);
    if (queryType?.fields) {
      tags.push({ name: 'Query', description: 'GraphQL queries' });
      for (const field of queryType.fields) {
        operations.push(fieldToOperation(field, 'query', types));
      }
    }
  }

  // Convert Mutation fields to operations
  if (schema.mutationType?.name) {
    const mutationType = types.get(schema.mutationType.name);
    if (mutationType?.fields) {
      tags.push({ name: 'Mutation', description: 'GraphQL mutations' });
      for (const field of mutationType.fields) {
        operations.push(fieldToOperation(field, 'mutation', types));
      }
    }
  }

  // Convert types to schemas (for input types and enums)
  for (const [name, type] of types) {
    if (!name.startsWith('__')) {
      if (type.kind === 'INPUT_OBJECT') {
        schemas[name] = inputTypeToSchema(type, types);
      } else if (type.kind === 'ENUM' && type.enumValues) {
        schemas[name] = {
          type: 'string',
          description: type.description,
          enum: type.enumValues.map((v) => v.name),
        };
      } else if (type.kind === 'OBJECT' && type.fields) {
        schemas[name] = objectTypeToSchema(type, types);
      }
    }
  }

  return {
    type: 'graphql',
    info: {
      title: title || 'GraphQL API',
      version: version || '1.0.0',
      description: description || `GraphQL API at ${endpoint}`,
    },
    servers: [{ url: endpoint, description: 'GraphQL endpoint' }],
    tags,
    operations,
    schemas,
    securitySchemes: {},
  };
}

function fieldToOperation(
  field: GraphqlField,
  operationType: 'query' | 'mutation',
  types: Map<string, GraphqlType>,
): Operation {
  const tag = operationType === 'query' ? 'Query' : 'Mutation';

  // For GraphQL, we don't use parameters - everything goes in the request body as variables
  // This avoids duplication in the UI
  const parameters: Parameter[] = [];

  // Store GraphQL variable types for proper query generation
  const graphqlVariableTypes: Record<string, string> = {};

  // Build request body schema from args
  const requestBodySchema: Schema = {
    type: 'object',
    properties: {},
    required: [],
  };
  for (const arg of field.args) {
    const argSchema = typeRefToSchema(arg.type, types);
    // Add description to the schema if available
    if (arg.description) {
      argSchema.description = arg.description;
    }
    requestBodySchema.properties![arg.name] = argSchema;
    if (isNonNull(arg.type)) {
      (requestBodySchema.required as string[]).push(arg.name);
    }
    // Store the original GraphQL type for query generation
    graphqlVariableTypes[arg.name] = typeRefToGraphqlType(arg.type);
  }

  // Clean up required array if empty
  if ((requestBodySchema.required as string[]).length === 0) {
    requestBodySchema.required = undefined;
  }

  const requestBody: RequestBody | undefined =
    field.args.length > 0
      ? {
          required: field.args.some((a) => isNonNull(a.type)),
          content: {
            'application/json': {
              schema: requestBodySchema,
            },
          },
        }
      : undefined;

  // Build response schema
  const responseSchema = typeRefToSchema(field.type, types);
  const responses: Response[] = [
    {
      statusCode: '200',
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  [field.name]: responseSchema,
                },
              },
            },
          },
        },
      },
    },
  ];

  return {
    id: `${operationType}_${field.name}`,
    method: 'POST', // GraphQL always uses POST
    path: `/${operationType}/${field.name}`,
    summary: field.name,
    description: field.description,
    tags: [tag],
    deprecated: field.isDeprecated,
    parameters,
    requestBody,
    responses,
    // GraphQL-specific metadata
    graphqlOperation: operationType,
    graphqlField: field.name,
    graphqlVariableTypes,
  };
}

/**
 * Convert a GraphQL type reference to its string representation
 */
function typeRefToGraphqlType(typeRef: GraphqlTypeRef): string {
  if (typeRef.kind === 'NON_NULL' && typeRef.ofType) {
    return `${typeRefToGraphqlType(typeRef.ofType)}!`;
  }
  if (typeRef.kind === 'LIST' && typeRef.ofType) {
    return `[${typeRefToGraphqlType(typeRef.ofType)}]`;
  }
  return typeRef.name || 'String';
}

function typeRefToSchema(
  typeRef: GraphqlTypeRef,
  types: Map<string, GraphqlType>,
  visited: Set<string> = new Set(),
): Schema {
  if (typeRef.kind === 'NON_NULL' && typeRef.ofType) {
    return typeRefToSchema(typeRef.ofType, types, visited);
  }
  if (typeRef.kind === 'LIST' && typeRef.ofType) {
    return { type: 'array', items: typeRefToSchema(typeRef.ofType, types, visited) };
  }

  // Scalar types
  switch (typeRef.name) {
    case 'String':
      return { type: 'string' };
    case 'Int':
      return { type: 'integer' };
    case 'Float':
      return { type: 'number' };
    case 'Boolean':
      return { type: 'boolean' };
    case 'ID':
      return { type: 'string' };
    default:
      // Reference to custom type - inline it to avoid $ref resolution issues
      if (typeRef.name) {
        const referencedType = types.get(typeRef.name);
        if (!referencedType) {
          return { type: 'object' };
        }

        // Handle enums
        if (referencedType.kind === 'ENUM' && referencedType.enumValues) {
          return {
            type: 'string',
            enum: referencedType.enumValues.map((v) => v.name),
          };
        }

        // Handle input objects - inline them (with cycle detection)
        if (referencedType.kind === 'INPUT_OBJECT') {
          // Prevent infinite recursion for circular references
          if (visited.has(typeRef.name)) {
            return { type: 'object', description: typeRef.name };
          }
          visited.add(typeRef.name);

          const properties: Record<string, Schema> = {};
          const required: string[] = [];

          for (const field of referencedType.inputFields || []) {
            properties[field.name] = typeRefToSchema(field.type, types, visited);
            if (isNonNull(field.type)) {
              required.push(field.name);
            }
          }

          return {
            type: 'object',
            description: referencedType.description,
            properties,
            required: required.length > 0 ? required : undefined,
          };
        }

        // For other object types, just return a generic object
        return { type: 'object', description: typeRef.name };
      }
      return { type: 'object' };
  }
}

function inputTypeToSchema(type: GraphqlType, types: Map<string, GraphqlType>): Schema {
  const properties: Record<string, Schema> = {};
  const required: string[] = [];

  for (const field of type.inputFields || []) {
    properties[field.name] = typeRefToSchema(field.type, types);
    if (isNonNull(field.type)) {
      required.push(field.name);
    }
  }

  return {
    type: 'object',
    description: type.description,
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

function objectTypeToSchema(type: GraphqlType, types: Map<string, GraphqlType>): Schema {
  const properties: Record<string, Schema> = {};

  for (const field of type.fields || []) {
    properties[field.name] = typeRefToSchema(field.type, types);
  }

  return {
    type: 'object',
    description: type.description,
    properties,
  };
}

function isNonNull(typeRef: GraphqlTypeRef): boolean {
  return typeRef.kind === 'NON_NULL';
}
