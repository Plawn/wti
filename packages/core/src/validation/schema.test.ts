import { describe, expect, test } from 'bun:test';
import { coerceValue, validateParameterValue, validateSchema } from './schema';

describe('validateSchema', () => {
  test('validates string minLength', () => {
    const schema = { type: 'string' as const, minLength: 3 };
    const result = validateSchema('ab', schema);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].keyword).toBe('minLength');
  });

  test('validates string maxLength', () => {
    const schema = { type: 'string' as const, maxLength: 5 };
    const result = validateSchema('toolong', schema);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('maxLength');
  });

  test('validates string pattern', () => {
    const schema = { type: 'string' as const, pattern: '^[a-z]+$' };
    const result = validateSchema('ABC123', schema);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('pattern');
  });

  test('validates number minimum', () => {
    const schema = { type: 'number' as const, minimum: 10 };
    const result = validateSchema(5, schema);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('minimum');
  });

  test('validates number maximum', () => {
    const schema = { type: 'number' as const, maximum: 100 };
    const result = validateSchema(150, schema);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('maximum');
  });

  test('validates enum', () => {
    const schema = { type: 'string' as const, enum: ['red', 'green', 'blue'] };
    const result = validateSchema('yellow', schema);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('enum');
  });

  test('passes valid values', () => {
    const schema = { type: 'string' as const, minLength: 2, maxLength: 10 };
    const result = validateSchema('hello', schema);

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});

describe('coerceValue', () => {
  test('coerces to number', () => {
    expect(coerceValue('42', { type: 'number' })).toBe(42);
    expect(coerceValue('3.14', { type: 'number' })).toBe(3.14);
  });

  test('coerces to integer', () => {
    expect(coerceValue('42', { type: 'integer' })).toBe(42);
  });

  test('coerces to boolean', () => {
    expect(coerceValue('true', { type: 'boolean' })).toBe(true);
    expect(coerceValue('false', { type: 'boolean' })).toBe(false);
  });

  test('returns undefined for empty string', () => {
    expect(coerceValue('', { type: 'string' })).toBe(undefined);
  });

  test('leaves strings as-is', () => {
    expect(coerceValue('hello', { type: 'string' })).toBe('hello');
  });
});

describe('validateParameterValue', () => {
  test('validates required empty field', () => {
    const result = validateParameterValue('', { type: 'string' }, true);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('required');
  });

  test('allows empty field when not required', () => {
    const result = validateParameterValue('', { type: 'string' }, false);

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  test('validates string input against schema', () => {
    const result = validateParameterValue('ab', { type: 'string', minLength: 3 }, false);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('minLength');
  });

  test('validates number input', () => {
    const result = validateParameterValue('150', { type: 'number', maximum: 100 }, false);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('maximum');
  });

  test('detects invalid number format', () => {
    const result = validateParameterValue('notanumber', { type: 'number' }, false);

    expect(result.valid).toBe(false);
    expect(result.errors[0].keyword).toBe('type');
  });

  test('passes valid input', () => {
    const result = validateParameterValue('hello', { type: 'string', minLength: 2 }, false);

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});
