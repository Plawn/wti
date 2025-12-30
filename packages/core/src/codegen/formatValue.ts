/**
 * Shared value formatting utilities for code generators
 */

export interface LanguageKeywords {
  null: string;
  undefined: string;
  true: string;
  false: string;
  /** Indent increment per level (e.g., 2 for JS, 4 for Python) */
  indentSize: number;
  /** Format object key (e.g., JS allows unquoted keys, Python always quotes) */
  formatKey: (key: string) => string;
}

export const jsKeywords: LanguageKeywords = {
  null: 'null',
  undefined: 'undefined',
  true: 'true',
  false: 'false',
  indentSize: 2,
  formatKey: (key: string) => (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key)),
};

export const pythonKeywords: LanguageKeywords = {
  null: 'None',
  undefined: 'None',
  true: 'True',
  false: 'False',
  indentSize: 4,
  formatKey: (key: string) => JSON.stringify(key),
};

/**
 * Format a value as a language literal.
 * Works for JavaScript, Python, and similar languages with configurable keywords.
 */
export function formatValue(
  value: unknown,
  indent: number,
  prettyPrint: boolean,
  keywords: LanguageKeywords,
): string {
  if (value === null) {
    return keywords.null;
  }
  if (value === undefined) {
    return keywords.undefined;
  }
  if (value === true) {
    return keywords.true;
  }
  if (value === false) {
    return keywords.false;
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    return String(value);
  }

  const nextIndent = indent + keywords.indentSize;

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    const items = value.map((v) => formatValue(v, nextIndent, prettyPrint, keywords));
    if (prettyPrint) {
      const pad = ' '.repeat(nextIndent);
      return `[\n${pad}${items.join(`,\n${pad}`)}\n${' '.repeat(indent)}]`;
    }
    return `[${items.join(', ')}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return '{}';
    }
    const items = entries.map(
      ([k, v]) => `${keywords.formatKey(k)}: ${formatValue(v, nextIndent, prettyPrint, keywords)}`,
    );
    if (prettyPrint) {
      const pad = ' '.repeat(nextIndent);
      return `{\n${pad}${items.join(`,\n${pad}`)}\n${' '.repeat(indent)}}`;
    }
    return `{${items.join(', ')}}`;
  }

  return String(value);
}

/**
 * Format a value as a JavaScript literal
 */
export function formatJsValue(value: unknown, indent: number, prettyPrint: boolean): string {
  return formatValue(value, indent, prettyPrint, jsKeywords);
}

/**
 * Format a value as a Python literal
 */
export function formatPythonValue(value: unknown, indent: number, prettyPrint: boolean): string {
  return formatValue(value, indent, prettyPrint, pythonKeywords);
}

/**
 * Build a URL with query parameters appended
 */
export function buildUrlWithParams(baseUrl: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }
  const searchParams = new URLSearchParams(params);
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${searchParams.toString()}`;
}
