/**
 * gRPC-specific types
 */

export interface GrpcEndpoint {
  /** The gRPC server endpoint URL */
  url: string;
  /** Use TLS/HTTPS */
  useTls?: boolean;
}

export interface GrpcService {
  /** Fully qualified service name (e.g., "grpc.reflection.v1.ServerReflection") */
  name: string;
  /** List of methods in the service */
  methods: GrpcMethod[];
}

export interface GrpcMethod {
  /** Method name */
  name: string;
  /** Full method path (e.g., "/package.Service/Method") */
  fullPath: string;
  /** Input message type name */
  inputType: string;
  /** Output message type name */
  outputType: string;
  /** Whether the client streams */
  clientStreaming: boolean;
  /** Whether the server streams */
  serverStreaming: boolean;
  /** Method description from comments */
  description?: string;
}

export interface GrpcMessageType {
  /** Fully qualified message name */
  name: string;
  /** Fields in the message */
  fields: GrpcField[];
  /** Nested message types */
  nestedTypes?: GrpcMessageType[];
  /** Enum types */
  enumTypes?: GrpcEnumType[];
  /** Description from comments */
  description?: string;
}

export interface GrpcField {
  /** Field name */
  name: string;
  /** Field number in proto */
  number: number;
  /** Field type */
  type: GrpcFieldType;
  /** For message/enum types, the type name */
  typeName?: string;
  /** Whether the field is repeated */
  repeated: boolean;
  /** Whether the field is optional */
  optional: boolean;
  /** Whether the field is part of a map */
  isMap: boolean;
  /** For map fields, the key type */
  mapKeyType?: GrpcFieldType;
  /** For map fields, the value type */
  mapValueType?: GrpcFieldType;
  /** Description from comments */
  description?: string;
  /** Default value */
  defaultValue?: unknown;
}

export type GrpcFieldType =
  | 'double'
  | 'float'
  | 'int32'
  | 'int64'
  | 'uint32'
  | 'uint64'
  | 'sint32'
  | 'sint64'
  | 'fixed32'
  | 'fixed64'
  | 'sfixed32'
  | 'sfixed64'
  | 'bool'
  | 'string'
  | 'bytes'
  | 'message'
  | 'enum';

export interface GrpcEnumType {
  /** Enum name */
  name: string;
  /** Enum values */
  values: GrpcEnumValue[];
  /** Description from comments */
  description?: string;
}

export interface GrpcEnumValue {
  /** Value name */
  name: string;
  /** Value number */
  number: number;
  /** Description from comments */
  description?: string;
}

export interface GrpcCallOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Metadata/headers to send */
  metadata?: Record<string, string>;
  /** AbortSignal to cancel the request */
  signal?: AbortSignal;
}

export interface GrpcResponse<T = unknown> {
  /** Response message */
  message: T;
  /** Response metadata/trailers */
  metadata?: Record<string, string>;
  /** Response status */
  status: GrpcStatus;
}

export interface GrpcStreamResponse<T = unknown> {
  /** Stream of response messages */
  messages: AsyncIterable<T>;
  /** Response metadata (available after stream ends) */
  metadata?: Record<string, string>;
}

export interface GrpcStatus {
  /** gRPC status code */
  code: GrpcStatusCode;
  /** Status message */
  message: string;
}

export enum GrpcStatusCode {
  OK = 0,
  CANCELLED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16,
}

export interface ReflectionResponse {
  services: GrpcService[];
  messageTypes: Map<string, GrpcMessageType>;
  enumTypes: Map<string, GrpcEnumType>;
}
