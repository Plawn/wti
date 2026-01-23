/**
 * Python code generator for GraphQL requests
 */

import { formatPythonValue } from './formatValue';
import type { CodeGenOptions, Generator, GraphqlRequestConfig } from './types';

/**
 * Generate Python requests code for GraphQL request
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

  lines.push('import requests');
  lines.push('');
  lines.push(`url = "${request.endpoint}"`);
  lines.push('');

  // Headers
  lines.push('headers = {');
  lines.push('    "Content-Type": "application/json",');
  if (request.headers) {
    for (const [key, value] of Object.entries(request.headers)) {
      lines.push(`    "${key}": "${value}",`);
    }
  }
  lines.push('}');
  lines.push('');

  // Request body
  lines.push(`payload = ${formatPythonValue(body, 0, prettyPrint)}`);
  lines.push('');

  // Make the request
  lines.push('response = requests.post(url, json=payload, headers=headers)');
  lines.push('result = response.json()');
  lines.push('');
  lines.push('if "errors" in result:');
  lines.push('    print("GraphQL errors:", result["errors"])');
  lines.push('');
  lines.push('print(result.get("data"))');

  return lines.join('\n');
}

export const graphqlPythonGenerator: Generator<GraphqlRequestConfig> = {
  language: 'python',
  displayName: 'Python',
  extension: 'py',
  generate,
};
