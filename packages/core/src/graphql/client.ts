/**
 * GraphQL request execution client
 */

import type { ResponseData, ResponseTiming } from '../types';

export interface GraphqlRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Execute a GraphQL request
 */
export async function executeGraphqlRequest(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>,
  operationName?: string,
  options?: GraphqlRequestOptions,
): Promise<ResponseData> {
  const startTime = performance.now();

  const body = JSON.stringify({
    query,
    variables,
    operationName,
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body,
    signal:
      options?.signal ?? (options?.timeout ? AbortSignal.timeout(options.timeout) : undefined),
  });

  const endTime = performance.now();
  const bodyText = await response.text();

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(bodyText);
  } catch {
    parsedBody = bodyText;
  }

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const timing: ResponseTiming = {
    startTime,
    endTime,
    duration: endTime - startTime,
  };

  return {
    status: response.status,
    statusText: response.statusText,
    headers,
    body: parsedBody,
    bodyText,
    timing,
  };
}

/**
 * Build a GraphQL query string with proper variable syntax
 */
export function buildGraphqlQuery(
  operationType: 'query' | 'mutation',
  fieldName: string,
  variables: Record<string, unknown>,
  variableTypes?: Record<string, string>,
  returnFields?: string[],
): string {
  // Filter out empty/null variables
  const activeVars = Object.entries(variables).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );

  if (activeVars.length === 0) {
    const fields = returnFields?.join('\n    ') || '__typename';
    return `${operationType} {\n  ${fieldName} {\n    ${fields}\n  }\n}`;
  }

  // Build variable declarations for query header
  const varDeclarations = activeVars
    .map(([name]) => {
      const type = variableTypes?.[name] || inferGraphqlType(variables[name]);
      return `$${name}: ${type}`;
    })
    .join(', ');

  // Build field arguments using variable references
  const fieldArgs = activeVars.map(([name]) => `${name}: $${name}`).join(', ');

  const fields = returnFields?.join('\n    ') || '__typename';

  return `${operationType}(${varDeclarations}) {\n  ${fieldName}(${fieldArgs}) {\n    ${fields}\n  }\n}`;
}

/**
 * Infer GraphQL type from a JavaScript value (best effort)
 */
function inferGraphqlType(value: unknown): string {
  if (value === null || value === undefined) {
    return 'String';
  }
  if (typeof value === 'string') {
    return 'String';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'Int' : 'Float';
  }
  if (typeof value === 'boolean') {
    return 'Boolean';
  }
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return `[${inferGraphqlType(value[0])}]`;
    }
    return '[String]';
  }
  return 'String';
}
