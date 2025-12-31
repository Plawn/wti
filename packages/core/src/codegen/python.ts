/**
 * Python (requests) code generator
 */

import type { RequestConfig } from '../types';
import { formatPythonValue } from './formatValue';
import type { CodeGenOptions, CodeGenerator } from './types';

/**
 * Generate Python requests code from request config
 */
function generate(request: RequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const lines: string[] = [];

  lines.push('import requests');
  lines.push('');

  // URL
  lines.push(`url = "${request.url}"`);

  // Query params
  if (request.params && Object.keys(request.params).length > 0) {
    lines.push(`params = ${formatPythonValue(request.params, 0, prettyPrint)}`);
  }

  // Headers
  if (request.headers && Object.keys(request.headers).length > 0) {
    lines.push(`headers = ${formatPythonValue(request.headers, 0, prettyPrint)}`);
  }

  // Body
  if (request.body !== undefined && request.body !== null) {
    if (typeof request.body === 'object') {
      lines.push(`payload = ${formatPythonValue(request.body, 0, prettyPrint)}`);
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
    const contentType =
      request.headers?.['Content-Type'] || request.headers?.['content-type'] || '';
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

  lines.push('response.raise_for_status()');
  lines.push('');

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
