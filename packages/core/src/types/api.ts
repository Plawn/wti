/**
 * Unified API specification types for OpenAPI and gRPC
 */

// Import and re-export Schema types from glass-ui (source of truth)
import type { Schema, SchemaType } from 'glass-ui-solid';
export type { Schema, SchemaType };

export type SpecType = 'openapi' | 'grpc';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

export type AuthType = 'apiKey' | 'bearer' | 'basic' | 'oauth2' | 'openIdConnect';

export interface ApiInfo {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export interface Server {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
}

export interface ServerVariable {
  default: string;
  description?: string;
  enum?: string[];
}

export interface Parameter {
  name: string;
  in: ParameterLocation;
  description?: string;
  required: boolean;
  deprecated?: boolean;
  schema: Schema;
  example?: unknown;
  examples?: Record<string, Example>;
}

export interface Example {
  summary?: string;
  description?: string;
  value?: unknown;
  externalValue?: string;
}

export interface MediaType {
  schema?: Schema;
  example?: unknown;
  examples?: Record<string, Example>;
  encoding?: Record<string, Encoding>;
}

export interface Encoding {
  contentType?: string;
  headers?: Record<string, Parameter>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface RequestBody {
  description?: string;
  required: boolean;
  content: Record<string, MediaType>;
}

export interface Response {
  statusCode: string;
  description: string;
  headers?: Record<string, Parameter>;
  content?: Record<string, MediaType>;
}

export interface SecurityRequirement {
  type: AuthType;
  name: string;
  in?: 'header' | 'query' | 'cookie';
  scheme?: string;
  flows?: OAuth2Flows;
  scopes?: string[];
  openIdConnectUrl?: string;
}

export interface OAuth2Flows {
  implicit?: OAuth2Flow;
  password?: OAuth2Flow;
  clientCredentials?: OAuth2Flow;
  authorizationCode?: OAuth2Flow;
}

export interface OAuth2Flow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

export interface Operation {
  id: string;
  method: HttpMethod | 'GRPC';
  path: string;
  summary?: string;
  description?: string;
  tags: string[];
  deprecated?: boolean;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  security?: SecurityRequirement[];
  externalDocs?: {
    url: string;
    description?: string;
  };
  /** gRPC input message type name (only for gRPC operations) */
  grpcInputType?: string;
  /** gRPC output message type name (only for gRPC operations) */
  grpcOutputType?: string;
}

export interface Tag {
  name: string;
  description?: string;
  externalDocs?: {
    url: string;
    description?: string;
  };
}

export interface ApiSpec {
  type: SpecType;
  info: ApiInfo;
  servers: Server[];
  tags: Tag[];
  operations: Operation[];
  schemas: Record<string, Schema>;
  securitySchemes: Record<string, SecurityRequirement>;
}

// Input types for loading specs
export interface OpenApiInput {
  type: 'openapi';
  url?: string;
  spec?: unknown;
}

export interface GrpcInput {
  type: 'grpc';
  endpoint: string;
  useTls?: boolean;
}

export type SpecInput = OpenApiInput | GrpcInput;
