import { describe, expect, test } from 'bun:test';
import {
  buildUrlWithParams,
  formatJsValue,
  formatPythonValue,
  jsKeywords,
  pythonKeywords,
} from './formatValue';

describe('formatJsValue', () => {
  test('formats null', () => {
    expect(formatJsValue(null, 0, false)).toBe('null');
  });

  test('formats undefined', () => {
    expect(formatJsValue(undefined, 0, false)).toBe('undefined');
  });

  test('formats booleans', () => {
    expect(formatJsValue(true, 0, false)).toBe('true');
    expect(formatJsValue(false, 0, false)).toBe('false');
  });

  test('formats strings with quotes', () => {
    expect(formatJsValue('hello', 0, false)).toBe('"hello"');
    expect(formatJsValue('hello "world"', 0, false)).toBe('"hello \\"world\\""');
  });

  test('formats numbers', () => {
    expect(formatJsValue(42, 0, false)).toBe('42');
    expect(formatJsValue(3.14, 0, false)).toBe('3.14');
  });

  test('formats empty array', () => {
    expect(formatJsValue([], 0, false)).toBe('[]');
  });

  test('formats array compact', () => {
    expect(formatJsValue([1, 2, 3], 0, false)).toBe('[1, 2, 3]');
  });

  test('formats array with pretty print', () => {
    const result = formatJsValue([1, 2], 0, true);
    expect(result).toContain('\n');
    expect(result).toContain('1');
    expect(result).toContain('2');
  });

  test('formats empty object', () => {
    expect(formatJsValue({}, 0, false)).toBe('{}');
  });

  test('formats object compact', () => {
    expect(formatJsValue({ a: 1, b: 2 }, 0, false)).toBe('{a: 1, b: 2}');
  });

  test('quotes object keys with special characters', () => {
    expect(formatJsValue({ 'my-key': 1 }, 0, false)).toBe('{"my-key": 1}');
  });

  test('formats nested objects', () => {
    const result = formatJsValue({ user: { name: 'John' } }, 0, false);
    expect(result).toBe('{user: {name: "John"}}');
  });
});

describe('formatPythonValue', () => {
  test('formats None', () => {
    expect(formatPythonValue(null, 0, false)).toBe('None');
    expect(formatPythonValue(undefined, 0, false)).toBe('None');
  });

  test('formats booleans with Python keywords', () => {
    expect(formatPythonValue(true, 0, false)).toBe('True');
    expect(formatPythonValue(false, 0, false)).toBe('False');
  });

  test('always quotes object keys', () => {
    expect(formatPythonValue({ key: 1 }, 0, false)).toBe('{"key": 1}');
  });
});

describe('jsKeywords.formatKey', () => {
  test('allows valid identifier keys unquoted', () => {
    expect(jsKeywords.formatKey('name')).toBe('name');
    expect(jsKeywords.formatKey('_private')).toBe('_private');
    expect(jsKeywords.formatKey('$jquery')).toBe('$jquery');
    expect(jsKeywords.formatKey('camelCase')).toBe('camelCase');
  });

  test('quotes keys with special characters', () => {
    expect(jsKeywords.formatKey('my-key')).toBe('"my-key"');
    expect(jsKeywords.formatKey('my key')).toBe('"my key"');
    expect(jsKeywords.formatKey('123')).toBe('"123"');
  });
});

describe('pythonKeywords.formatKey', () => {
  test('always quotes keys', () => {
    expect(pythonKeywords.formatKey('name')).toBe('"name"');
    expect(pythonKeywords.formatKey('my-key')).toBe('"my-key"');
  });
});

describe('buildUrlWithParams', () => {
  test('returns URL unchanged when no params', () => {
    expect(buildUrlWithParams('https://api.example.com')).toBe('https://api.example.com');
    expect(buildUrlWithParams('https://api.example.com', {})).toBe('https://api.example.com');
  });

  test('appends params with ? for URLs without query string', () => {
    const result = buildUrlWithParams('https://api.example.com', { page: '1' });
    expect(result).toBe('https://api.example.com?page=1');
  });

  test('appends params with & for URLs with existing query string', () => {
    const result = buildUrlWithParams('https://api.example.com?existing=1', { page: '2' });
    expect(result).toBe('https://api.example.com?existing=1&page=2');
  });

  test('handles multiple params', () => {
    const result = buildUrlWithParams('https://api.example.com', { page: '1', limit: '10' });
    expect(result).toContain('page=1');
    expect(result).toContain('limit=10');
  });

  test('encodes special characters', () => {
    const result = buildUrlWithParams('https://api.example.com', { q: 'hello world' });
    expect(result).toContain('hello+world');
  });
});
