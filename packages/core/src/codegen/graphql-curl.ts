/**
 * cURL code generator for GraphQL requests
 */

import type { CodeGenOptions, Generator, GraphqlRequestConfig } from './types';

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
 * Generate cURL command from GraphQL request config
 */
function generate(request: GraphqlRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const lines: string[] = [];

  // Build the request body
  const body: Record<string, unknown> = {
    query: request.query,
  };
  if (request.variables && Object.keys(request.variables).length > 0) {
    body.variables = request.variables;
  }
  if (request.operationName) {
    body.operationName = request.operationName;
  }

  const bodyJson = JSON.stringify(body, null, prettyPrint ? 2 : 0);

  if (prettyPrint) {
    lines.push('curl \\');
    lines.push('  -X POST \\');
    lines.push(`  ${shellEscape(request.endpoint)} \\`);
    lines.push("  -H 'Content-Type: application/json' \\");

    // Add custom headers
    if (request.headers) {
      for (const [key, value] of Object.entries(request.headers)) {
        lines.push(`  -H '${key}: ${value}' \\`);
      }
    }

    lines.push(`  -d '${bodyJson.replace(/'/g, "'\\''")}'`);
  } else {
    const parts: string[] = ['curl', '-X', 'POST', shellEscape(request.endpoint)];
    parts.push('-H', "'Content-Type: application/json'");
    if (request.headers) {
      for (const [key, value] of Object.entries(request.headers)) {
        parts.push('-H', `'${key}: ${value}'`);
      }
    }
    parts.push('-d', `'${bodyJson.replace(/'/g, "'\\''")}'`);
    lines.push(parts.join(' '));
  }

  return lines.join('\n');
}

export const graphqlCurlGenerator: Generator<GraphqlRequestConfig> = {
  language: 'curl',
  displayName: 'cURL',
  extension: 'sh',
  generate,
};
