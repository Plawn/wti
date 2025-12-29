/**
 * Python (requests) code generator
 */

import type { RequestConfig } from '../types';
import type { CodeGenOptions, CodeGenerator } from './types';

/**
 * Convert a value to Python literal
 */
function toPythonValue(value: unknown, indent: number, prettyPrint: boolean): string {
  if (value === null || value === undefined) return 'None';
  if (value === true) return 'True';
  if (value === false) return 'False';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => toPythonValue(v, indent + 4, prettyPrint));
    if (prettyPrint) {
      const pad = ' '.repeat(indent + 4);
      return `[\n${pad}${items.join(`,\n${pad}`)}\n${' '.repeat(indent)}]`;
    }
    return `[${items.join(', ')}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const items = entries.map(([k, v]) => `${JSON.stringify(k)}: ${toPythonValue(v, indent + 4, prettyPrint)}`);
    if (prettyPrint) {
      const pad = ' '.repeat(indent + 4);
      return `{\n${pad}${items.join(`,\n${pad}`)}\n${' '.repeat(indent)}}`;
    }
    return `{${items.join(', ')}}`;
  }

  return String(value);
}

/**
 * Generate Python requests code from request config
 */
function generate(request: RequestConfig, options: CodeGenOptions = {}): string {
  const { includeComments = true, prettyPrint = true } = options;
  const lines: string[] = [];

  if (includeComments) {
    lines.push('# HTTP request using requests library');
  }
  lines.push('import requests');
  lines.push('');

  // URL
  lines.push(`url = "${request.url}"`);

  // Query params
  if (request.params && Object.keys(request.params).length > 0) {
    lines.push(`params = ${toPythonValue(request.params, 0, prettyPrint)}`);
  }

  // Headers
  if (request.headers && Object.keys(request.headers).length > 0) {
    lines.push(`headers = ${toPythonValue(request.headers, 0, prettyPrint)}`);
  }

  // Body
  if (request.body !== undefined && request.body !== null) {
    if (typeof request.body === 'object') {
      lines.push(`payload = ${toPythonValue(request.body, 0, prettyPrint)}`);
    } else {
      lines.push(`payload = ${JSON.stringify(request.body)}`);
    }
  }

  lines.push('');

  // Build request call
  const method = request.method.toLowerCase();
  const args: string[] = ['url'];

  if (request.params && Object.keys(request.params).length > 0) {
    args.push('params=params');
  }

  if (request.headers && Object.keys(request.headers).length > 0) {
    args.push('headers=headers');
  }

  if (request.body !== undefined && request.body !== null) {
    const contentType = request.headers?.['Content-Type'] || request.headers?.['content-type'] || '';
    if (contentType.includes('application/json') || typeof request.body === 'object') {
      args.push('json=payload');
    } else {
      args.push('data=payload');
    }
  }

  if (prettyPrint && args.length > 2) {
    lines.push(`response = requests.${method}(`);
    for (let i = 0; i < args.length; i++) {
      const comma = i < args.length - 1 ? ',' : '';
      lines.push(`    ${args[i]}${comma}`);
    }
    lines.push(')');
  } else {
    lines.push(`response = requests.${method}(${args.join(', ')})`);
  }

  lines.push('');

  if (includeComments) {
    lines.push('# Check for errors');
  }
  lines.push('response.raise_for_status()');
  lines.push('');

  if (includeComments) {
    lines.push('# Parse response');
  }
  lines.push('data = response.json()');
  lines.push('print(data)');

  return lines.join('\n');
}

export const pythonGenerator: CodeGenerator = {
  language: 'python',
  displayName: 'Python',
  extension: 'py',
  generate,
};
