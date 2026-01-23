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

export interface GrpcRequestOptions {
  timeout?: number;
  signal?: AbortSignal;
  metadata?: Record<string, string>;
  /** Encoder function for binary protobuf (if not provided, uses JSON) */
  encode?: (body: unknown) => Uint8Array;
  /** Decoder function for binary protobuf (if not provided, uses JSON) */
  decode?: (data: Uint8Array) => unknown;
}

/**
 * Execute a gRPC-Web request
 * Supports both binary protobuf (when encode/decode provided) and JSON fallback
 */
export async function executeGrpcRequest(
  url: string,
  method: string,
  body: unknown,
  options: GrpcRequestOptions = {},
): Promise<{
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  bodyText: string;
  grpcStatus?: { code: number; message: string };
  timing: { startTime: number; endTime: number; duration: number };
}> {
  const { timeout = 30000, signal, metadata = {}, encode, decode } = options;

  // Use binary protobuf if encoder is provided
  const useBinary = encode !== undefined;

  // Build full URL
  const fullUrl = `${url.replace(/\/$/, '')}${method}`;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : undefined;

  const combinedSignal = signal ? combineSignals(signal, controller.signal) : controller.signal;

  const startTime = performance.now();

  try {
    // Encode request body
    let bodyBytes: Uint8Array;
    if (useBinary && encode) {
      bodyBytes = encode(body);
    } else {
      const jsonBody = JSON.stringify(body);
      bodyBytes = new TextEncoder().encode(jsonBody);
    }

    // Create gRPC-Web frame: 1 byte flag + 4 bytes length (big-endian) + message
    const frame = new Uint8Array(5 + bodyBytes.length);
    frame[0] = 0x00; // Data frame flag
    const view = new DataView(frame.buffer);
    view.setUint32(1, bodyBytes.length, false); // Big-endian length
    frame.set(bodyBytes, 5);

    const contentType = useBinary ? 'application/grpc-web+proto' : 'application/grpc-web+json';

    // Filter out Content-Type and Accept from metadata - gRPC-Web requires specific values
    const filteredMetadata = Object.fromEntries(
      Object.entries(metadata).filter(
        ([key]) => !['content-type', 'accept'].includes(key.toLowerCase()),
      ),
    );

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        ...filteredMetadata,
        'Content-Type': contentType,
        Accept: contentType,
        'X-Grpc-Web': '1',
      },
      body: frame,
      signal: combinedSignal,
    });

    const endTime = performance.now();

    // Get response headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Parse response
    const responseBuffer = await response.arrayBuffer();
    const responseData = new Uint8Array(responseBuffer);

    // Parse gRPC-Web frames
    const { messages, trailers } = parseGrpcWebFrames(responseData);

    // Parse gRPC status from trailers
    const grpcStatus = parseGrpcStatus(trailers);

    // Decode response message
    let responseBody: unknown = null;
    let bodyText = '';

    if (messages.length > 0) {
      if (useBinary && decode) {
        responseBody = decode(messages[0]);
        bodyText = JSON.stringify(responseBody, null, 2);
      } else {
        bodyText = new TextDecoder().decode(messages[0]);
        try {
          responseBody = JSON.parse(bodyText);
        } catch {
          responseBody = bodyText;
        }
      }
    }

    // If gRPC status indicates error, adjust HTTP-like status
    const httpStatus =
      grpcStatus.code === GrpcStatusCode.OK ? response.status : grpcStatusToHttp(grpcStatus.code);

    return {
      status: httpStatus,
      statusText: grpcStatus.code === GrpcStatusCode.OK ? response.statusText : grpcStatus.message,
      headers,
      body: responseBody,
      bodyText,
      grpcStatus: { code: grpcStatus.code, message: grpcStatus.message },
      timing: {
        startTime,
        endTime,
        duration: endTime - startTime,
      },
    };
  } catch (error) {
    const endTime = performance.now();

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        status: 504,
        statusText: 'Request timeout',
        headers: {},
        body: null,
        bodyText: '',
        grpcStatus: { code: GrpcStatusCode.DEADLINE_EXCEEDED, message: 'Request timeout' },
        timing: { startTime, endTime, duration: endTime - startTime },
      };
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 503,
      statusText: errorMessage,
      headers: {},
      body: null,
      bodyText: '',
      grpcStatus: { code: GrpcStatusCode.UNAVAILABLE, message: errorMessage },
      timing: { startTime, endTime, duration: endTime - startTime },
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Map gRPC status codes to HTTP status codes
 */
function grpcStatusToHttp(code: GrpcStatusCode): number {
  switch (code) {
    case GrpcStatusCode.OK:
      return 200;
    case GrpcStatusCode.CANCELLED:
      return 499;
    case GrpcStatusCode.INVALID_ARGUMENT:
      return 400;
    case GrpcStatusCode.DEADLINE_EXCEEDED:
      return 504;
    case GrpcStatusCode.NOT_FOUND:
      return 404;
    case GrpcStatusCode.ALREADY_EXISTS:
      return 409;
    case GrpcStatusCode.PERMISSION_DENIED:
      return 403;
    case GrpcStatusCode.RESOURCE_EXHAUSTED:
      return 429;
    case GrpcStatusCode.FAILED_PRECONDITION:
      return 400;
    case GrpcStatusCode.ABORTED:
      return 409;
    case GrpcStatusCode.OUT_OF_RANGE:
      return 400;
    case GrpcStatusCode.UNIMPLEMENTED:
      return 501;
    case GrpcStatusCode.INTERNAL:
      return 500;
    case GrpcStatusCode.UNAVAILABLE:
      return 503;
    case GrpcStatusCode.DATA_LOSS:
      return 500;
    case GrpcStatusCode.UNAUTHENTICATED:
      return 401;
    default:
      return 500;
  }
}

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
