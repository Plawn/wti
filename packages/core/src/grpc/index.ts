/**
 * gRPC support module
 *
 * Provides gRPC-Web client, server reflection, and conversion to unified ApiSpec
 */

export {
  createGrpcClient,
  executeGrpcRequest,
  type GrpcClient,
  type GrpcClientOptions,
  type GrpcRequestOptions,
} from './client';

export {
  createReflectionClient,
  type ReflectionClient,
} from './reflection';

export { convertGrpcToSpec, type ConvertOptions } from './converter';

export { encodeMessage, createMessageEncoder } from './encoder';
export { decodeMessage, createMessageDecoder } from './decoder';

export {
  type GrpcEndpoint,
  type GrpcService,
  type GrpcMethod,
  type GrpcMessageType,
  type GrpcField,
  type GrpcFieldType,
  type GrpcEnumType,
  type GrpcEnumValue,
  type GrpcCallOptions,
  type GrpcResponse,
  type GrpcStreamResponse,
  type GrpcStatus,
  GrpcStatusCode,
  GrpcError,
  type ReflectionResponse,
} from './types';

import type { ApiSpec } from '../types';
import type { GrpcEnumType, GrpcMessageType } from './types';

export interface GrpcSpecResult {
  spec: ApiSpec;
  /** Message types from reflection (for encoding requests) */
  messageTypes: Map<string, GrpcMessageType>;
  /** Enum types from reflection (for encoding requests) */
  enumTypes: Map<string, GrpcEnumType>;
}

/**
 * Load a gRPC API spec from a server using reflection
 */
export async function loadGrpcSpec(
  serverUrl: string,
  options?: {
    title?: string;
    version?: string;
    description?: string;
  },
): Promise<GrpcSpecResult> {
  const { createReflectionClient } = await import('./reflection');
  const { convertGrpcToSpec } = await import('./converter');

  const client = createReflectionClient(serverUrl);

  try {
    const reflection = await client.discoverServices();

    const spec = convertGrpcToSpec(reflection, {
      serverUrl,
      title: options?.title,
      version: options?.version,
      description: options?.description,
    });

    return {
      spec,
      messageTypes: reflection.messageTypes,
      enumTypes: reflection.enumTypes,
    };
  } finally {
    client.close();
  }
}
