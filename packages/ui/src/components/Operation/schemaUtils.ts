import type { Schema } from 'glass-ui-solid';

/**
 * Generate an example value from a JSON schema
 */
export function generateSchemaExample(schema: Schema): unknown {
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  if (!type) {
    return {};
  }

  switch (type) {
    case 'object':
      if (schema.properties) {
        const obj: Record<string, unknown> = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = generateSchemaExample(prop as Schema);
        }
        return obj;
      }
      return {};
    case 'array':
      if (schema.items) {
        return [generateSchemaExample(schema.items as Schema)];
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
