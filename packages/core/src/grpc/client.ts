/**
 * gRPC-Web client for making unary and streaming calls
 * Uses proper gRPC-Web binary framing protocol
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
 * Encode a message with gRPC-Web framing
 * Format: 1 byte flag + 4 bytes length (big-endian) + message
 */
function encodeGrpcWebFrame(data: Uint8Array, isTrailer = false): Uint8Array {
  const frame = new Uint8Array(5 + data.length);
  // Flag: 0 for data, 0x80 for trailers
  frame[0] = isTrailer ? 0x80 : 0x00;
  // Length as big-endian uint32
  const view = new DataView(frame.buffer);
  view.setUint32(1, data.length, false);
  // Message data
  frame.set(data, 5);
  return frame;
}

/**
 * Parse gRPC-Web frames from response
 */
function parseGrpcWebFrames(data: Uint8Array): {
  messages: Uint8Array[];
  trailers: Record<string, string>;
} {
  const messages: Uint8Array[] = [];
  const trailers: Record<string, string> = {};
  let offset = 0;

  while (offset < data.length) {
    if (offset + 5 > data.length) {
      break;
    }

    const flag = data[offset];
    const view = new DataView(data.buffer, data.byteOffset + offset + 1, 4);
    const length = view.getUint32(0, false);

    if (offset + 5 + length > data.length) {
      break;
    }

    const payload = data.slice(offset + 5, offset + 5 + length);

    if (flag & 0x80) {
      // Trailer frame - parse as text
      const text = new TextDecoder().decode(payload);
      for (const line of text.split('\r\n')) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
          const key = line.substring(0, colonIdx).trim().toLowerCase();
          const value = line.substring(colonIdx + 1).trim();
          trailers[key] = value;
        }
      }
    } else {
      // Data frame
      messages.push(payload);
    }

    offset += 5 + length;
  }

  return { messages, trailers };
}

/**
 * Parse gRPC status from trailers
 */
function parseGrpcStatus(trailers: Record<string, string>): {
  code: GrpcStatusCode;
  message: string;
} {
  const codeStr = trailers['grpc-status'];
  const message = trailers['grpc-message'] || '';

  if (codeStr === undefined) {
    return { code: GrpcStatusCode.OK, message: 'OK' };
  }

  const code = Number.parseInt(codeStr, 10);
  return {
    code: Number.isNaN(code) ? GrpcStatusCode.UNKNOWN : code,
    message: decodeURIComponent(message.replace(/\+/g, ' ')),
  };
}

/**
 * Create a gRPC-Web client with proper binary protocol support
 */
export function createGrpcClient(options: GrpcClientOptions) {
  const { baseUrl, timeout = 30000, defaultMetadata = {} } = options;

  /**
   * Make a raw gRPC-Web unary call with binary data
   */
  async function unaryCallRaw(
    method: string,
    requestData: Uint8Array,
    callOptions: GrpcCallOptions = {},
  ): Promise<{ data: Uint8Array; status: { code: GrpcStatusCode; message: string } }> {
    const url = `${baseUrl.replace(/\/$/, '')}${method}`;
    const metadata = { ...defaultMetadata, ...callOptions.metadata };

    const controller = new AbortController();
    const timeoutMs = callOptions.timeout ?? timeout;
    const timeoutId = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

    const signal = callOptions.signal
      ? combineSignals(callOptions.signal, controller.signal)
      : controller.signal;

    try {
      const framedRequest = encodeGrpcWebFrame(requestData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/grpc-web+proto',
          Accept: 'application/grpc-web+proto',
          'X-Grpc-Web': '1',
          ...metadata,
        },
        body: framedRequest as unknown as BodyInit,
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          data: new Uint8Array(),
          status: {
            code: httpToGrpcStatus(response.status),
            message: errorText || response.statusText,
          },
        };
      }

      const responseBuffer = await response.arrayBuffer();
      const responseData = new Uint8Array(responseBuffer);

      const { messages, trailers } = parseGrpcWebFrames(responseData);
      const status = parseGrpcStatus(trailers);

      return {
        data: messages[0] || new Uint8Array(),
        status,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          data: new Uint8Array(),
          status: {
            code: GrpcStatusCode.DEADLINE_EXCEEDED,
            message: 'Request timeout',
          },
        };
      }

      return {
        data: new Uint8Array(),
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
   * Make a unary gRPC call (kept for API compatibility, but now expects typed encoder/decoder)
   */
  async function unaryCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
    callOptions: GrpcCallOptions & {
      encode?: (msg: TRequest) => Uint8Array;
      decode?: (data: Uint8Array) => TResponse;
    } = {},
  ): Promise<GrpcResponse<TResponse>> {
    const { encode, decode, ...restOptions } = callOptions;

    // If no encoder provided, fall back to JSON (for backward compat with tests)
    const requestData = encode
      ? encode(request)
      : new TextEncoder().encode(JSON.stringify(request));

    const result = await unaryCallRaw(method, requestData, restOptions);

    if (result.status.code !== GrpcStatusCode.OK) {
      return {
        message: {} as TResponse,
        status: result.status,
      };
    }

    // If no decoder provided, fall back to JSON
    const message = decode
      ? decode(result.data)
      : (JSON.parse(new TextDecoder().decode(result.data)) as TResponse);

    return {
      message,
      status: result.status,
    };
  }

  /**
   * Make a server streaming gRPC call with raw binary data
   */
  async function serverStreamingCallRaw(
    method: string,
    requestData: Uint8Array,
    callOptions: GrpcCallOptions = {},
  ): Promise<{ messages: AsyncIterable<Uint8Array>; metadata: Record<string, string> }> {
    const url = `${baseUrl.replace(/\/$/, '')}${method}`;
    const metadata = { ...defaultMetadata, ...callOptions.metadata };

    const controller = new AbortController();
    const signal = callOptions.signal
      ? combineSignals(callOptions.signal, controller.signal)
      : controller.signal;

    const framedRequest = encodeGrpcWebFrame(requestData);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/grpc-web+proto',
        Accept: 'application/grpc-web+proto',
        'X-Grpc-Web': '1',
        ...metadata,
      },
      body: framedRequest as unknown as BodyInit,
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

    const streamReader = reader;

    async function* streamMessages(): AsyncIterable<Uint8Array> {
      let buffer = new Uint8Array();

      while (true) {
        const { done, value } = await streamReader.read();

        if (done) {
          break;
        }

        // Append to buffer
        const newBuffer = new Uint8Array(buffer.length + value.length);
        newBuffer.set(buffer);
        newBuffer.set(value, buffer.length);
        buffer = newBuffer;

        // Parse complete frames
        while (buffer.length >= 5) {
          const view = new DataView(buffer.buffer, buffer.byteOffset + 1, 4);
          const length = view.getUint32(0, false);

          if (buffer.length < 5 + length) {
            break;
          }

          const flag = buffer[0];
          const payload = buffer.slice(5, 5 + length);
          buffer = buffer.slice(5 + length);

          // Only yield data frames, not trailer frames
          if (!(flag & 0x80)) {
            yield payload;
          }
        }
      }
    }

    return {
      messages: streamMessages(),
      metadata: {},
    };
  }

  /**
   * Make a server streaming gRPC call
   */
  async function serverStreamingCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
    callOptions: GrpcCallOptions & {
      encode?: (msg: TRequest) => Uint8Array;
      decode?: (data: Uint8Array) => TResponse;
    } = {},
  ): Promise<GrpcStreamResponse<TResponse>> {
    const { encode, decode, ...restOptions } = callOptions;

    const requestData = encode
      ? encode(request)
      : new TextEncoder().encode(JSON.stringify(request));

    const result = await serverStreamingCallRaw(method, requestData, restOptions);

    async function* transformMessages(): AsyncIterable<TResponse> {
      for await (const data of result.messages) {
        if (decode) {
          yield decode(data);
        } else {
          yield JSON.parse(new TextDecoder().decode(data)) as TResponse;
        }
      }
    }

    return {
      messages: transformMessages(),
      metadata: result.metadata,
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
    unaryCallRaw,
    serverStreamingCall,
    serverStreamingCallRaw,
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
