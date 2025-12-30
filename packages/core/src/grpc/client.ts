/**
 * gRPC-Web client for making unary and streaming calls
 */

import { combineSignals } from '../utils/signals';
import {
  type GrpcCallOptions,
  type GrpcResponse,
  GrpcStatusCode,
  type GrpcStreamResponse,
} from './types';

export interface GrpcClientOptions {
  /** Base URL of the gRPC-Web server */
  baseUrl: string;
  /** Default timeout in milliseconds */
  timeout?: number;
  /** Default metadata to include in all requests */
  defaultMetadata?: Record<string, string>;
}

/**
 * Create a gRPC-Web client
 */
export function createGrpcClient(options: GrpcClientOptions) {
  const { baseUrl, timeout = 30000, defaultMetadata = {} } = options;

  /**
   * Make a unary gRPC call
   */
  async function unaryCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
    callOptions: GrpcCallOptions = {},
  ): Promise<GrpcResponse<TResponse>> {
    const url = `${baseUrl.replace(/\/$/, '')}${method}`;
    const metadata = { ...defaultMetadata, ...callOptions.metadata };

    const controller = new AbortController();
    const timeoutMs = callOptions.timeout ?? timeout;
    const timeoutId = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

    // Combine signals
    const signal = callOptions.signal
      ? combineSignals(callOptions.signal, controller.signal)
      : controller.signal;

    try {
      // Encode the request as JSON (gRPC-Web with JSON encoding)
      const body = JSON.stringify(request);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...metadata,
        },
        body,
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          message: {} as TResponse,
          status: {
            code: httpToGrpcStatus(response.status),
            message: errorText || response.statusText,
          },
        };
      }

      const responseBody = await response.json();

      // Extract trailing metadata from headers
      const responseMetadata: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        if (key.startsWith('grpc-')) {
          responseMetadata[key] = value;
        }
      });

      return {
        message: responseBody as TResponse,
        metadata: responseMetadata,
        status: {
          code: GrpcStatusCode.OK,
          message: 'OK',
        },
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          message: {} as TResponse,
          status: {
            code: GrpcStatusCode.DEADLINE_EXCEEDED,
            message: 'Request timeout',
          },
        };
      }

      return {
        message: {} as TResponse,
        status: {
          code: GrpcStatusCode.UNAVAILABLE,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Make a server streaming gRPC call
   */
  async function serverStreamingCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
    callOptions: GrpcCallOptions = {},
  ): Promise<GrpcStreamResponse<TResponse>> {
    const url = `${baseUrl.replace(/\/$/, '')}${method}`;
    const metadata = { ...defaultMetadata, ...callOptions.metadata };

    const controller = new AbortController();
    const signal = callOptions.signal
      ? combineSignals(callOptions.signal, controller.signal)
      : controller.signal;

    const body = JSON.stringify(request);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/x-ndjson',
        ...metadata,
      },
      body,
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`gRPC error: ${httpToGrpcStatus(response.status)} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();

    async function* streamMessages(): AsyncIterable<TResponse> {
      let buffer = '';

      while (reader) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse newline-delimited JSON
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              yield JSON.parse(line) as TResponse;
            } catch {
              // Skip malformed lines
            }
          }
        }
      }

      // Parse any remaining buffer
      if (buffer.trim()) {
        try {
          yield JSON.parse(buffer) as TResponse;
        } catch {
          // Skip malformed data
        }
      }
    }

    return {
      messages: streamMessages(),
      metadata: {},
    };
  }

  /**
   * Cancel all pending requests
   */
  function close() {
    // No-op for now, individual requests handle their own cancellation
  }

  return {
    unaryCall,
    serverStreamingCall,
    close,
  };
}

export type GrpcClient = ReturnType<typeof createGrpcClient>;

/**
 * Map HTTP status codes to gRPC status codes
 */
function httpToGrpcStatus(httpStatus: number): GrpcStatusCode {
  switch (httpStatus) {
    case 200:
      return GrpcStatusCode.OK;
    case 400:
      return GrpcStatusCode.INVALID_ARGUMENT;
    case 401:
      return GrpcStatusCode.UNAUTHENTICATED;
    case 403:
      return GrpcStatusCode.PERMISSION_DENIED;
    case 404:
      return GrpcStatusCode.NOT_FOUND;
    case 409:
      return GrpcStatusCode.ABORTED;
    case 429:
      return GrpcStatusCode.RESOURCE_EXHAUSTED;
    case 499:
      return GrpcStatusCode.CANCELLED;
    case 500:
      return GrpcStatusCode.INTERNAL;
    case 501:
      return GrpcStatusCode.UNIMPLEMENTED;
    case 503:
      return GrpcStatusCode.UNAVAILABLE;
    case 504:
      return GrpcStatusCode.DEADLINE_EXCEEDED;
    default:
      return GrpcStatusCode.UNKNOWN;
  }
}
