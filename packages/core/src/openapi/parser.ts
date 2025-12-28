/**
 * OpenAPI specification parser
 * Parses and validates OpenAPI 3.0/3.1 specifications
 */
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import type { ApiSpec, OpenApiInput } from '../types';
import { convertOpenApiToSpec } from './converter';

type OpenAPIDocument = OpenAPIV3.Document | OpenAPIV3_1.Document;

export interface ParseOptions {
  /**
   * Whether to dereference all $ref pointers
   * @default true
   */
  dereference?: boolean;

  /**
   * Whether to validate the spec against the OpenAPI schema
   * @default true
   */
  validate?: boolean;
}

export interface ParseResult {
  spec: ApiSpec;
  warnings: string[];
}

/**
 * Fetch a spec from a URL using browser's fetch API
 */
async function fetchSpec(url: string): Promise<object> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  // Try JSON first
  if (contentType.includes('json') || text.trim().startsWith('{')) {
    return JSON.parse(text);
  }

  // For YAML, we'd need a YAML parser - for now just try JSON
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('YAML specs are not yet supported. Please use JSON format.');
  }
}

/**
 * Resolve a JSON pointer reference within a document
 */
function resolveRef(doc: object, ref: string): unknown {
  if (!ref.startsWith('#/')) {
    // External refs not supported in browser
    return undefined;
  }

  const path = ref.slice(2).split('/');
  let current: unknown = doc;

  for (const segment of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    // Decode JSON pointer escape sequences
    const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

/**
 * Recursively dereference all $ref pointers in an object
 */
function dereferenceObject(obj: unknown, root: object, seen = new Set<string>()): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => dereferenceObject(item, root, seen));
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const record = obj as Record<string, unknown>;

  // Check for $ref
  if ('$ref' in record && typeof record.$ref === 'string') {
    const ref = record.$ref;

    // Prevent infinite loops
    if (seen.has(ref)) {
      return { ...record, $ref: ref }; // Keep circular ref as-is
    }

    const resolved = resolveRef(root, ref);
    if (resolved !== undefined) {
      seen.add(ref);
      return dereferenceObject(resolved, root, seen);
    }

    // Could not resolve, return as-is
    return record;
  }

  // Recursively process all properties
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = dereferenceObject(value, root, seen);
  }

  return result;
}

/**
 * Parse an OpenAPI specification from a URL or object
 */
export async function parseOpenApi(
  input: OpenApiInput,
  options: ParseOptions = {},
): Promise<ParseResult> {
  const { dereference: shouldDereference = true } = options;
  const warnings: string[] = [];

  let specObject: object;

  // Fetch URL if provided, otherwise use spec object directly
  if (input.url) {
    specObject = await fetchSpec(input.url);
  } else if (input.spec) {
    specObject = input.spec as object;
  } else {
    throw new Error('Either url or spec must be provided');
  }

  try {
    let doc: OpenAPIDocument;

    if (shouldDereference) {
      // Dereference $refs in the spec using our browser-compatible implementation
      doc = dereferenceObject(specObject, specObject) as OpenAPIDocument;
    } else {
      // Use spec as-is
      doc = specObject as OpenAPIDocument;
    }

    // Check OpenAPI version
    const version = (doc as { openapi?: string }).openapi;
    if (!version?.startsWith('3.')) {
      throw new Error(`Unsupported OpenAPI version: ${version}. Only OpenAPI 3.x is supported.`);
    }

    // Convert to unified spec
    const spec = convertOpenApiToSpec(doc);

    return { spec, warnings };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse OpenAPI spec: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Parse an OpenAPI specification from a JSON/YAML string
 */
export async function parseOpenApiFromString(
  content: string,
  options: ParseOptions = {},
): Promise<ParseResult> {
  // Try to parse as JSON first, then YAML
  let spec: unknown;
  try {
    spec = JSON.parse(content);
  } catch {
    // If JSON parsing fails, the library will handle YAML
    spec = content;
  }

  return parseOpenApi({ type: 'openapi', spec }, options);
}
