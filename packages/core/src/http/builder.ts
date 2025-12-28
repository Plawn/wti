/**
 * Request builder for constructing HTTP requests from API operations
 */
import type { Operation, Parameter, RequestConfig, Server } from '../types';
import type { AuthConfig } from '../types/auth';

export interface RequestValues {
  /**
   * Path parameter values
   */
  path?: Record<string, string>;

  /**
   * Query parameter values
   */
  query?: Record<string, string>;

  /**
   * Header values
   */
  headers?: Record<string, string>;

  /**
   * Request body
   */
  body?: unknown;

  /**
   * Content type for the request body
   */
  contentType?: string;
}

export interface BuildOptions {
  /**
   * Server to use for the request
   */
  server: Server;

  /**
   * Server variable values
   */
  serverVariables?: Record<string, string>;

  /**
   * Authentication configuration
   */
  auth?: AuthConfig;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
}

/**
 * Build a request configuration from an operation and values
 */
export function buildRequestConfig(
  operation: Operation,
  values: RequestValues,
  options: BuildOptions,
): RequestConfig {
  // Build URL with path parameters
  const baseUrl = resolveServerUrl(options.server, options.serverVariables);
  const path = substitutePathParams(operation.path, values.path);
  const url = joinUrl(baseUrl, path);

  // Build headers
  const headers: Record<string, string> = {
    ...values.headers,
  };

  // Add content type if body is present
  if (values.body !== undefined && values.contentType) {
    headers['Content-Type'] = values.contentType;
  }

  // Apply authentication
  if (options.auth) {
    applyAuth(headers, values.query || {}, options.auth);
  }

  return {
    method: operation.method === 'GRPC' ? 'POST' : operation.method,
    url,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
    params: values.query,
    body: values.body,
    timeout: options.timeout,
  };
}

/**
 * Resolve server URL with variables
 */
function resolveServerUrl(server: Server, variables?: Record<string, string>): string {
  let url = server.url;

  if (server.variables) {
    for (const [name, variable] of Object.entries(server.variables)) {
      const value = variables?.[name] ?? variable.default;
      url = url.replace(`{${name}}`, value);
    }
  }

  return url;
}

/**
 * Substitute path parameters in the path template
 */
function substitutePathParams(path: string, params?: Record<string, string>): string {
  if (!params) return path;

  let result = path;
  for (const [name, value] of Object.entries(params)) {
    result = result.replace(`{${name}}`, encodeURIComponent(value));
  }

  return result;
}

/**
 * Join base URL and path
 */
function joinUrl(base: string, path: string): string {
  // Handle absolute URLs in server
  if (base.startsWith('http://') || base.startsWith('https://')) {
    const baseWithoutTrailingSlash = base.endsWith('/') ? base.slice(0, -1) : base;
    const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
    return `${baseWithoutTrailingSlash}${pathWithLeadingSlash}`;
  }

  // Handle relative URLs
  const baseNormalized = base.endsWith('/') ? base.slice(0, -1) : base;
  const pathNormalized = path.startsWith('/') ? path : `/${path}`;
  return `${baseNormalized}${pathNormalized}`;
}

/**
 * Apply authentication to request headers/params
 */
function applyAuth(
  headers: Record<string, string>,
  params: Record<string, string>,
  auth: AuthConfig,
): void {
  switch (auth.type) {
    case 'apiKey':
      if (auth.in === 'header') {
        headers[auth.name] = auth.value;
      } else if (auth.in === 'query') {
        params[auth.name] = auth.value;
      }
      break;

    case 'bearer':
      headers.Authorization = `${auth.scheme || 'Bearer'} ${auth.token}`;
      break;

    case 'basic': {
      const credentials = btoa(`${auth.username}:${auth.password}`);
      headers.Authorization = `Basic ${credentials}`;
      break;
    }

    case 'oauth2':
      if (auth.accessToken) {
        headers.Authorization = `${auth.tokenType || 'Bearer'} ${auth.accessToken}`;
      }
      break;

    case 'openid':
      if (auth.accessToken) {
        headers.Authorization = `${auth.tokenType || 'Bearer'} ${auth.accessToken}`;
      }
      break;
  }
}

/**
 * Extract default values from operation parameters
 */
export function getDefaultValues(operation: Operation): RequestValues {
  const path: Record<string, string> = {};
  const query: Record<string, string> = {};
  const headers: Record<string, string> = {};

  for (const param of operation.parameters) {
    const defaultValue = getParamDefaultValue(param);
    if (defaultValue !== undefined) {
      const value = String(defaultValue);
      switch (param.in) {
        case 'path':
          path[param.name] = value;
          break;
        case 'query':
          query[param.name] = value;
          break;
        case 'header':
          headers[param.name] = value;
          break;
      }
    }
  }

  return {
    path: Object.keys(path).length > 0 ? path : undefined,
    query: Object.keys(query).length > 0 ? query : undefined,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  };
}

/**
 * Get default value for a parameter
 */
function getParamDefaultValue(param: Parameter): unknown {
  // Check example first
  if (param.example !== undefined) {
    return param.example;
  }

  // Check examples
  if (param.examples) {
    const firstExample = Object.values(param.examples)[0];
    if (firstExample?.value !== undefined) {
      return firstExample.value;
    }
  }

  // Check schema default
  if (param.schema.default !== undefined) {
    return param.schema.default;
  }

  // Check enum first value
  if (param.schema.enum && param.schema.enum.length > 0) {
    return param.schema.enum[0];
  }

  return undefined;
}

/**
 * Get the preferred content type for a request body
 */
export function getPreferredContentType(operation: Operation): string | undefined {
  if (!operation.requestBody?.content) {
    return undefined;
  }

  const contentTypes = Object.keys(operation.requestBody.content);

  // Prefer JSON
  if (contentTypes.includes('application/json')) {
    return 'application/json';
  }

  // Then form data
  if (contentTypes.includes('multipart/form-data')) {
    return 'multipart/form-data';
  }

  if (contentTypes.includes('application/x-www-form-urlencoded')) {
    return 'application/x-www-form-urlencoded';
  }

  // Return first available
  return contentTypes[0];
}
