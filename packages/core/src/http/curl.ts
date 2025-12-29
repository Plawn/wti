import type { RequestConfig } from '../types';

/**
 * Generates a cURL command from a request configuration
 */
export function generateCurlCommand(config: RequestConfig): string {
  const parts: string[] = ['curl'];

  // Method (default GET is often omitted, but let's be explicit for clarity)
  if (config.method.toUpperCase() !== 'GET') {
    parts.push(`-X ${config.method.toUpperCase()}`);
  }

  // URL
  // Ensure we quote the URL
  parts.push(`'${config.url}'`);

  // Headers
  if (config.headers) {
    for (const [key, value] of Object.entries(config.headers)) {
      parts.push(`-H '${key}: ${value}'`);
    }
  }

  // Body
  if (config.body) {
    if (typeof config.body === 'string') {
      parts.push(`-d '${config.body.replace(/'/g, "'\\''")}'`);
    } else if (config.body instanceof FormData) {
      // FormData is tricky in cURL, usually implied by -F
      // For simplicity in display, we might skip showing the full binary data
      parts.push('# FormData body not fully represented in cURL preview');
    } else {
      // JSON or other object
      const bodyStr = JSON.stringify(config.body);
      parts.push(`-d '${bodyStr.replace(/'/g, "'\\''")}'`);
    }
  }

  return parts.join(
    ' \
  ',
  );
}
