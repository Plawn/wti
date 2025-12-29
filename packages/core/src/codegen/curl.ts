/**
 * cURL code generator
 */

import type { RequestConfig } from '../types';
import type { CodeGenOptions, CodeGenerator } from './types';

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
 * Format JSON body for cURL
 */
function formatBody(body: unknown, prettyPrint: boolean): string {
  if (body === undefined || body === null) {
    return '';
  }
  if (typeof body === 'string') {
    return body;
  }
  return JSON.stringify(body, null, prettyPrint ? 2 : 0);
}

/**
 * Generate cURL command from request config
 */
function generate(request: RequestConfig, options: CodeGenOptions = {}): string {
  const { includeComments = true, prettyPrint = true } = options;
  const lines: string[] = [];

  if (includeComments) {
    lines.push('# HTTP request using cURL');
  }

  // Start with curl command
  const parts: string[] = ['curl'];

  // Add method (if not GET)
  if (request.method !== 'GET') {
    parts.push('-X', request.method);
  }

  // Build URL with query params
  let url = request.url;
  if (request.params && Object.keys(request.params).length > 0) {
    const searchParams = new URLSearchParams(request.params);
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}${searchParams.toString()}`;
  }

  // Add headers
  const headers = request.headers || {};
  for (const [key, value] of Object.entries(headers)) {
    parts.push('-H', `${key}: ${value}`);
  }

  // Add body
  if (request.body !== undefined && request.body !== null) {
    const bodyStr = formatBody(request.body, prettyPrint);
    if (bodyStr) {
      // Check if content-type suggests JSON
      const contentType = headers['Content-Type'] || headers['content-type'] || '';
      if (contentType.includes('application/json') || typeof request.body === 'object') {
        parts.push('-d', bodyStr);
      } else {
        parts.push('--data-raw', bodyStr);
      }
    }
  }

  // Add URL at the end
  parts.push(shellEscape(url));

  if (prettyPrint) {
    // Format with line continuations
    lines.push(parts[0]); // 'curl'
    for (let i = 1; i < parts.length; i += 2) {
      if (i + 1 < parts.length && parts[i].startsWith('-')) {
        lines.push(`  ${parts[i]} ${shellEscape(parts[i + 1])} \\`);
      } else {
        // URL at the end
        lines.push(`  ${parts[i]}`);
      }
    }
    // Remove trailing backslash from last option line
    const lastIdx = lines.length - 2;
    if (lastIdx > 0 && lines[lastIdx].endsWith(' \\')) {
      lines[lastIdx] = lines[lastIdx].slice(0, -2);
    }
  } else {
    lines.push(parts.map((p, i) => (i > 0 && !p.startsWith('-') ? shellEscape(p) : p)).join(' '));
  }

  return lines.join('\n');
}

export const curlGenerator: CodeGenerator = {
  language: 'curl',
  displayName: 'cURL',
  extension: 'sh',
  generate,
};
