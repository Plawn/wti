/**
 * JavaScript code generator for GraphQL requests
 */

import { formatJsValue } from './formatValue';
import type { CodeGenOptions, Generator, GraphqlRequestConfig } from './types';

/**
 * Generate JavaScript fetch code for GraphQL request
 */
function generate(request: GraphqlRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const indent = prettyPrint ? '  ' : '';
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

  // Using fetch API
  lines.push('// Using fetch API');
  lines.push(`const response = await fetch('${request.endpoint}', {`);
  lines.push(`${indent}method: 'POST',`);
  lines.push(`${indent}headers: {`);
  lines.push(`${indent}${indent}'Content-Type': 'application/json',`);
  if (request.headers) {
    for (const [key, value] of Object.entries(request.headers)) {
      lines.push(`${indent}${indent}'${key}': '${value}',`);
    }
  }
  lines.push(`${indent}},`);
  lines.push(
    `${indent}body: JSON.stringify(${formatJsValue(body, prettyPrint ? 4 : 0, prettyPrint)}),`,
  );
  lines.push('});');
  lines.push('');
  lines.push('const result = await response.json();');
  lines.push('');
  lines.push('if (result.errors) {');
  lines.push(`${indent}console.error('GraphQL errors:', result.errors);`);
  lines.push('}');
  lines.push('');
  lines.push('console.log(result.data);');

  return lines.join('\n');
}

export const graphqlJavascriptGenerator: Generator<GraphqlRequestConfig> = {
  language: 'javascript',
  displayName: 'JavaScript',
  extension: 'js',
  generate,
};
