/**
 * Generate an example value from a JSON schema
 */
export function generateSchemaExample(schema: {
  type?: string;
  properties?: Record<string, unknown>;
  items?: unknown;
}): unknown {
  if (!schema.type) return {};

  switch (schema.type) {
    case 'object':
      if (schema.properties) {
        const obj: Record<string, unknown> = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = generateSchemaExample(
            prop as { type?: string; properties?: Record<string, unknown> },
          );
        }
        return obj;
      }
      return {};
    case 'array':
      if (schema.items) {
        return [generateSchemaExample(schema.items as { type?: string })];
      }
      return [];
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return true;
    default:
      return null;
  }
}

/**
 * Safely parse JSON with error handling
 * Returns undefined if parsing fails
 */
export function safeJsonParse<T = unknown>(json: string): T | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}
