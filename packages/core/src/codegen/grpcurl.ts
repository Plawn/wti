/**
 * grpcurl code generator
 */

import type { CodeGenOptions, Generator, GrpcRequestConfig } from './types';

/**
 * Escape a string for shell usage
 */
function shellEscape(str: string): string {
  if (!/[^a-zA-Z0-9_\-.,/:@]/.test(str)) {
    return str;
  }
  return `'${str.replace(/'/g, "'\\''")}'`;
}

/**
 * Generate grpcurl command from gRPC request config
 */
function generate(request: GrpcRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const parts: string[] = ['grpcurl'];

  // Add plaintext flag if not using TLS
  if (!request.useTls) {
    parts.push('-plaintext');
  }

  // Add metadata headers
  if (request.metadata) {
    for (const [key, value] of Object.entries(request.metadata)) {
      parts.push('-H', `${key}: ${value}`);
    }
  }

  // Add request data
  if (request.message !== undefined && request.message !== null) {
    const messageJson = JSON.stringify(request.message, null, prettyPrint ? 2 : 0);
    parts.push('-d', messageJson);
  }

  // Add endpoint and method
  parts.push(request.endpoint);
  // Remove leading slash from method path for grpcurl
  const methodPath = request.methodPath.startsWith('/')
    ? request.methodPath.slice(1)
    : request.methodPath;
  parts.push(methodPath);

  if (prettyPrint) {
    const lines: string[] = [];
    lines.push(parts[0]); // 'grpcurl'

    let i = 1;
    while (i < parts.length) {
      const part = parts[i];
      if (part.startsWith('-')) {
        // Flag with value
        if (part === '-d') {
          // Multi-line data
          const data = parts[i + 1];
          lines.push(`  ${part} '${data.replace(/'/g, "'\\''")}' \\`);
          i += 2;
        } else if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
          lines.push(`  ${part} ${shellEscape(parts[i + 1])} \\`);
          i += 2;
        } else {
          lines.push(`  ${part} \\`);
          i += 1;
        }
      } else {
        // Endpoint and method (last two args)
        if (i === parts.length - 2) {
          lines.push(`  ${shellEscape(part)} \\`);
        } else {
          lines.push(`  ${shellEscape(part)}`);
        }
        i += 1;
      }
    }

    // Remove trailing backslash from second-to-last line
    const lastIdx = lines.length - 2;
    if (lastIdx > 0 && lines[lastIdx].endsWith(' \\')) {
      lines[lastIdx] = lines[lastIdx].slice(0, -2);
    }

    return lines.join('\n');
  }

  return parts.map((p, i) => (i > 0 && !p.startsWith('-') ? shellEscape(p) : p)).join(' ');
}

export const grpcurlGenerator: Generator<GrpcRequestConfig> = {
  language: 'grpcurl',
  displayName: 'grpcurl',
  extension: 'sh',
  generate,
};
