/**
 * Format a value as pretty-printed JSON string.
 * Returns the stringified value directly if it's not valid for JSON.stringify.
 */
export function formatJson(value: unknown, indent = 2): string {
  try {
    return JSON.stringify(value, null, indent);
  } catch {
    return String(value);
  }
}

/**
 * Safely parse a JSON string, returning the fallback value on error.
 */
export function parseJsonSafe<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Convert a value to a display string, handling null/undefined.
 * Useful for form inputs that need string values.
 */
export function toDisplayString(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

/**
 * Convert a value to a display string, with JSON formatting for objects.
 * Useful for complex form inputs.
 */
export function toDisplayStringJson(value: unknown, indent = 2): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value, null, indent);
  return String(value);
}
