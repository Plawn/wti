/**
 * JavaScript (fetch) code generator
 */

import type { RequestConfig } from '../types';
import type { CodeGenOptions, CodeGenerator } from './types';

/**
 * Format a JavaScript value for code output
 */
function formatValue(value: unknown, indent: number, prettyPrint: boolean): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => formatValue(v, indent + 2, prettyPrint));
    if (prettyPrint) {
      const pad = ' '.repeat(indent + 2);
      return `[\n${pad}${items.join(`,\n${pad}`)}\n${' '.repeat(indent)}]`;
    }
    return `[${items.join(', ')}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const items = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
      return `${key}: ${formatValue(v, indent + 2, prettyPrint)}`;
    });
    if (prettyPrint) {
      const pad = ' '.repeat(indent + 2);
      return `{\n${pad}${items.join(`,\n${pad}`)}\n${' '.repeat(indent)}}`;
    }
    return `{ ${items.join(', ')} }`;
  }

  return String(value);
}

/**
 * Generate JavaScript fetch code from request config
 */
function generate(request: RequestConfig, options: CodeGenOptions = {}): string {
  const { includeComments = true, prettyPrint = true } = options;
  const lines: string[] = [];
  const indent = prettyPrint ? '  ' : '';

  if (includeComments) {
    lines.push('// HTTP request using fetch API');
    lines.push('');
  }

  // Build URL with query params
  let url = request.url;
  if (request.params && Object.keys(request.params).length > 0) {
    const searchParams = new URLSearchParams(request.params);
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}${searchParams.toString()}`;
  }

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
    lines.push(`${indent}const body = ${formatValue(request.body, 2, prettyPrint)};`);
    lines.push('');
  }

  // Build fetch options string
  const optionsLines: string[] = [];
  optionsLines.push(`${indent}${indent}method: '${request.method}',`);

  if (request.headers && Object.keys(request.headers).length > 0) {
    optionsLines.push(`${indent}${indent}headers: ${formatValue(request.headers, 4, prettyPrint)},`);
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

  if (includeComments) {
    lines.push('// Usage');
  }
  lines.push('makeRequest()');
  lines.push(`${indent}.then(data => console.log(data))`);
  lines.push(`${indent}.catch(error => console.error('Error:', error));`);

  return lines.join('\n');
}

export const javascriptGenerator: CodeGenerator = {
  language: 'javascript',
  displayName: 'JavaScript',
  extension: 'js',
  generate,
};
