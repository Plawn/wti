import type { Schema } from '@wti/core';

/**
 * Convert a value to a display string, handling null/undefined.
 * Useful for form inputs that need string values.
 */
export function toDisplayString(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

/**
 * Convert a value to a display string, with JSON formatting for objects.
 * Useful for complex form inputs.
 */
export function toDisplayStringJson(value: unknown, indent = 2): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, indent);
  }
  return String(value);
}

/**
 * Get default value for a schema type
 */
export function getDefaultValue(schema: Schema): unknown {
  if (schema.default !== undefined) {
    return schema.default;
  }

  const type = schema.type || 'string';
  switch (type) {
    case 'string':
      return '';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      if (schema.properties) {
        const obj: Record<string, unknown> = {};
        const required = schema.required || [];
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          if (required.includes(key)) {
            obj[key] = getDefaultValue(propSchema);
          }
        }
        return obj;
      }
      return {};
    default:
      return undefined;
  }
}
