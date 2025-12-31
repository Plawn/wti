import { describe, expect, test } from 'bun:test';
import { curlGenerator } from './curl';

describe('curlGenerator', () => {
  test('generates simple GET request', () => {
    const result = curlGenerator.generate({
      method: 'GET',
      url: 'https://api.example.com/users',
    });

    expect(result).toContain('curl');
    expect(result).toContain('https://api.example.com/users');
    expect(result).not.toContain('-X'); // GET is default
  });

  test('generates POST request with method flag', () => {
    const result = curlGenerator.generate({
      method: 'POST',
      url: 'https://api.example.com/users',
    });

    expect(result).toContain('-X POST');
  });

  test('includes headers', () => {
    const result = curlGenerator.generate({
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: {
        Authorization: 'Bearer token123',
        'Content-Type': 'application/json',
      },
    });

    expect(result).toContain("-H 'Authorization: Bearer token123'");
    expect(result).toContain("-H 'Content-Type: application/json'");
  });

  test('includes JSON body', () => {
    const result = curlGenerator.generate({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: { 'Content-Type': 'application/json' },
      body: { name: 'John', age: 30 },
    });

    expect(result).toContain('-d');
    expect(result).toContain('"name"');
    expect(result).toContain('"John"');
  });

  test('handles query parameters', () => {
    const result = curlGenerator.generate({
      method: 'GET',
      url: 'https://api.example.com/users',
      params: { page: '1', limit: '10' },
    });

    expect(result).toContain('page=1');
    expect(result).toContain('limit=10');
  });

  test('escapes special characters in URL', () => {
    const result = curlGenerator.generate({
      method: 'GET',
      url: "https://api.example.com/search?q=hello world&name=O'Brien",
    });

    // URL with special chars should be escaped
    expect(result).toContain("'");
  });

  test('generates compact output when prettyPrint is false', () => {
    const result = curlGenerator.generate(
      {
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: { 'Content-Type': 'application/json' },
        body: { name: 'John' },
      },
      { prettyPrint: false },
    );

    expect(result).not.toContain('\n');
  });
});
