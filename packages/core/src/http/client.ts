/**
 * HTTP client for executing API requests
 */
import type { RequestConfig, ResponseData, ResponseTiming } from '../types';
import { combineSignals } from '../utils/signals';

export interface ExecuteOptions {
  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * AbortSignal to cancel the request
   */
  signal?: AbortSignal;
}

/**
 * Execute an HTTP request and return the response
 */
export async function executeRequest(
  config: RequestConfig,
  options: ExecuteOptions = {},
): Promise<ResponseData> {
  const { timeout = config.timeout ?? 30000, signal } = options;

  // Build URL with query parameters
  const url = buildUrl(config.url, config.params);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : undefined;

  // Combine signals if external signal provided
  const combinedSignal = signal ? combineSignals(signal, controller.signal) : controller.signal;

  const startTime = performance.now();

  try {
    // GET and HEAD requests cannot have a body per the Fetch specification
    const canHaveBody = config.method !== 'GET' && config.method !== 'HEAD';

    const response = await fetch(url, {
      method: config.method,
      headers: config.headers,
      body:
        canHaveBody && config.body !== undefined
          ? serializeBody(config.body, config.headers)
          : undefined,
      signal: combinedSignal,
    });

    const endTime = performance.now();

    // Parse response body
    const contentType = response.headers.get('content-type') || '';
    const bodyText = await response.text();
    let body: unknown = bodyText;

    if (contentType.includes('application/json') && bodyText) {
      try {
        body = JSON.parse(bodyText);
      } catch {
        // Keep as text if JSON parsing fails
      }
    }

    // Convert headers to plain object
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
      body,
      bodyText,
      timing,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
    throw new Error('Request failed');
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Build URL with query parameters
 * Works in both browser and non-browser environments (Node.js, SSR, etc.)
 */
function buildUrl(baseUrl: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  // Check if URL is absolute (has protocol)
  const isAbsolute = /^https?:\/\//i.test(baseUrl);

  // For absolute URLs, we can use URL constructor directly
  if (isAbsolute) {
    const url = new URL(baseUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    }
    return url.toString();
  }

  // For relative URLs in browser, use window.location.origin as base
  if (typeof window !== 'undefined' && window.location?.origin) {
    const url = new URL(baseUrl, window.location.origin);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    }
    return url.toString();
  }

  // For relative URLs in non-browser environments, manually append query params
  const filteredParams = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );

  if (filteredParams.length === 0) {
    return baseUrl;
  }

  const queryString = filteredParams
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryString}`;
}

/**
 * Get header value case-insensitively
 * HTTP headers are case-insensitive per RFC 7230
 */
function getHeader(headers: Record<string, string> | undefined, name: string): string {
  if (!headers) {
    return '';
  }
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  return '';
}

/**
 * Serialize request body based on content type
 */
function serializeBody(body: unknown, headers?: Record<string, string>): BodyInit {
  if (body === null || body === undefined) {
    return '';
  }

  if (typeof body === 'string') {
    return body;
  }

  if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
    return body;
  }

  const contentType = getHeader(headers, 'Content-Type');

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return new URLSearchParams(body as Record<string, string>).toString();
  }

  // Default to JSON
  return JSON.stringify(body);
}
