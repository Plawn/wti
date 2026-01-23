/**
 * JavaScript (fetch) code generator
 */

import { buildUrlWithParams, formatJsValue } from './formatValue';
import type { CodeGenOptions, Generator, HttpRequestConfig } from './types';

/**
 * Generate JavaScript fetch code from request config
 */
function generate(request: HttpRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const lines: string[] = [];
  const indent = prettyPrint ? '  ' : '';

  // Build URL with query params
  const url = buildUrlWithParams(request.url, request.params);

  // Build options object
  const fetchOptions: Record<string, unknown> = {
    method: request.method,
  };

  if (request.headers && Object.keys(request.headers).length > 0) {
    fetchOptions.headers = request.headers;
  }

  if (request.body !== undefined && request.body !== null) {
    if (typeof request.body === 'object') {
      fetchOptions.body = 'JSON.stringify(body)';
    } else {
      fetchOptions.body = request.body;
    }
  }

  // Generate async function
  lines.push('async function makeRequest() {');

  // If body is an object, define it first
  if (request.body !== undefined && request.body !== null && typeof request.body === 'object') {
    lines.push(`${indent}const body = ${formatJsValue(request.body, 2, prettyPrint)};`);
    lines.push('');
  }

  // Build fetch options string
  const optionsLines: string[] = [];
  optionsLines.push(`${indent}${indent}method: '${request.method}',`);

  if (request.headers && Object.keys(request.headers).length > 0) {
    optionsLines.push(
      `${indent}${indent}headers: ${formatJsValue(request.headers, 4, prettyPrint)},`,
    );
  }

  if (request.body !== undefined && request.body !== null) {
    if (typeof request.body === 'object') {
      optionsLines.push(`${indent}${indent}body: JSON.stringify(body),`);
    } else {
      optionsLines.push(`${indent}${indent}body: ${JSON.stringify(request.body)},`);
    }
  }

  lines.push(`${indent}const response = await fetch('${url}', {`);
  for (const line of optionsLines) {
    lines.push(line);
  }
  lines.push(`${indent}});`);
  lines.push('');

  lines.push(`${indent}if (!response.ok) {`);
  lines.push(`${indent}${indent}throw new Error(\`HTTP error! status: \${response.status}\`);`);
  lines.push(`${indent}}`);
  lines.push('');

  lines.push(`${indent}const data = await response.json();`);
  lines.push(`${indent}return data;`);
  lines.push('}');
  lines.push('');

  lines.push('makeRequest()');
  lines.push(`${indent}.then(data => console.log(data))`);
  lines.push(`${indent}.catch(error => console.error('Error:', error));`);

  return lines.join('\n');
}

export const javascriptGenerator: Generator<HttpRequestConfig> = {
  language: 'javascript',
  displayName: 'JavaScript',
  extension: 'js',
  generate,
};
