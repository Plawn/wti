/**
 * gRPC support module
 *
 * Provides gRPC-Web client, server reflection, and conversion to unified ApiSpec
 */

export { createGrpcClient, type GrpcClient, type GrpcClientOptions } from './client';

export {
  createReflectionClient,
  type ReflectionClient,
} from './reflection';

export { convertGrpcToSpec, type ConvertOptions } from './converter';

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
  type ReflectionResponse,
} from './types';

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
) {
  const { createReflectionClient } = await import('./reflection');
  const { convertGrpcToSpec } = await import('./converter');

  const client = createReflectionClient(serverUrl);

  try {
    const reflection = await client.discoverServices();

    return convertGrpcToSpec(reflection, {
      serverUrl,
      title: options?.title,
      version: options?.version,
      description: options?.description,
    });
  } finally {
    client.close();
  }
}
