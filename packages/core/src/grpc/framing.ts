/**
 * gRPC-Web framing utilities
 * Handles encoding and decoding of gRPC-Web binary frames
 */

import { GrpcStatusCode } from './types';

/**
 * Encode a message with gRPC-Web framing
 * Format: 1 byte flag + 4 bytes length (big-endian) + message
 */
export function encodeGrpcWebFrame(data: Uint8Array, isTrailer = false): Uint8Array {
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
export function parseGrpcWebFrames(data: Uint8Array): {
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
export function parseGrpcStatus(trailers: Record<string, string>): {
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
