import Ajv, { type ErrorObject } from 'ajv';
import type { Schema } from '../types/api';

/**
 * Validation error with user-friendly message
 */
export interface ValidationError {
  /** The path to the property that failed validation (e.g., '/items/0') */
  path: string;
  /** User-friendly error message */
  message: string;
  /** The validation keyword that failed (e.g., 'minLength', 'type') */
  keyword: string;
  /** Additional parameters from the schema (e.g., { limit: 3 } for minLength) */
  params: Record<string, unknown>;
}

/**
 * Result of schema validation
 */
export interface ValidationResult {
  /** Whether the value is valid */
  valid: boolean;
  /** List of validation errors (empty if valid) */
  errors: ValidationError[];
}

// Singleton Ajv instance for performance
let ajvInstance: Ajv | null = null;

function getAjv(): Ajv {
  if (!ajvInstance) {
    ajvInstance = new Ajv({
      allErrors: true,
      strict: false,
      validateFormats: true,
    });
  }
  return ajvInstance;
}

/**
 * Convert Ajv error to user-friendly ValidationError
 */
function convertAjvError(error: ErrorObject): ValidationError {
  const path = error.instancePath || '/';
  const keyword = error.keyword;
  const params = error.params as Record<string, unknown>;

  // Generate user-friendly message based on keyword
  let message = error.message || 'Invalid value';

  switch (keyword) {
    case 'type':
      message = `must be ${params.type}`;
      break;
    case 'minLength':
      message = `must be at least ${params.limit} characters`;
      break;
    case 'maxLength':
      message = `must be at most ${params.limit} characters`;
      break;
    case 'minimum':
      message = `must be >= ${params.limit}`;
      break;
    case 'maximum':
      message = `must be <= ${params.limit}`;
      break;
    case 'exclusiveMinimum':
      message = `must be > ${params.limit}`;
      break;
    case 'exclusiveMaximum':
      message = `must be < ${params.limit}`;
      break;
    case 'multipleOf':
      message = `must be a multiple of ${params.multipleOf}`;
      break;
    case 'pattern':
      message = `must match pattern ${params.pattern}`;
      break;
    case 'enum':
      message = `must be one of: ${(params.allowedValues as unknown[]).join(', ')}`;
      break;
    case 'const':
      message = `must be equal to ${JSON.stringify(params.allowedValue)}`;
      break;
    case 'minItems':
      message = `must have at least ${params.limit} items`;
      break;
    case 'maxItems':
      message = `must have at most ${params.limit} items`;
      break;
    case 'uniqueItems':
      message = 'must have unique items';
      break;
    case 'required':
      message = `missing required property: ${params.missingProperty}`;
      break;
    case 'format':
      message = `must be a valid ${params.format}`;
      break;
  }

  return {
    path,
    message,
    keyword,
    params,
  };
}

/**
 * Validate a value against a JSON schema
 *
 * @param value - The value to validate (can be any type)
 * @param schema - The JSON schema to validate against
 * @returns ValidationResult with validity and any errors
 *
 * @example
 * ```typescript
 * const schema: Schema = { type: 'string', minLength: 3 };
 * const result = validateSchema('ab', schema);
 * // result.valid === false
 * // result.errors[0].message === 'must be at least 3 characters'
 * ```
 */
export function validateSchema(value: unknown, schema: Schema): ValidationResult {
  const ajv = getAjv();

  // Create a unique key for this schema to use compiled validator cache
  const validate = ajv.compile(schema);
  const valid = validate(value);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = (validate.errors || []).map(convertAjvError);
  return { valid: false, errors };
}

/**
 * Coerce a string value to the appropriate type based on schema
 * This is useful for form inputs which always return strings
 *
 * @param value - The string value from input
 * @param schema - The schema defining the expected type
 * @returns The coerced value
 */
export function coerceValue(value: string, schema: Schema): unknown {
  if (value === '') {
    return undefined;
  }

  const type = schema.type || 'string';

  switch (type) {
    case 'number':
      return Number(value);
    case 'integer':
      return Number.parseInt(value, 10);
    case 'boolean':
      return value === 'true';
    case 'array':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    case 'object':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    case 'null':
      return null;
    default:
      return value;
  }
}

/**
 * Validate a form input value against a parameter schema
 * This handles type coercion and required field validation
 *
 * @param value - The string value from form input
 * @param schema - The parameter schema
 * @param required - Whether the field is required
 * @returns ValidationResult with validity and errors
 */
export function validateParameterValue(
  value: string,
  schema: Schema,
  required: boolean,
): ValidationResult {
  // Handle empty values
  if (value === '' || value === undefined || value === null) {
    if (required) {
      return {
        valid: false,
        errors: [
          {
            path: '/',
            message: 'this field is required',
            keyword: 'required',
            params: {},
          },
        ],
      };
    }
    return { valid: true, errors: [] };
  }

  // Coerce value to the appropriate type
  const coercedValue = coerceValue(value, schema);

  // Handle NaN for numeric types
  if ((schema.type === 'number' || schema.type === 'integer') && Number.isNaN(coercedValue)) {
    return {
      valid: false,
      errors: [
        {
          path: '/',
          message: 'must be a valid number',
          keyword: 'type',
          params: { type: schema.type },
        },
      ],
    };
  }

  // Validate against schema
  return validateSchema(coercedValue, schema);
}
