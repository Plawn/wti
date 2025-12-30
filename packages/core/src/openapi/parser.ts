/**
 * OpenAPI specification parser
 * Parses and validates OpenAPI 3.0/3.1 specifications
 */
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { parse as parseYaml } from 'yaml';
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

  /**
   * Base URL for resolving relative external $refs
   * If not provided, relative refs will not be resolved
   */
  baseUrl?: string;
}

/**
 * Cache for fetched external documents
 * Key: absolute URL, Value: parsed document object
 */
type ExternalDocCache = Map<string, object>;

/**
 * Context for dereferencing operations
 */
interface DereferenceContext {
  /** The root document being parsed */
  root: object;
  /** Cache of fetched external documents */
  externalCache: ExternalDocCache;
  /** Set of refs currently being resolved (for circular ref detection) */
  resolving: Set<string>;
  /** Base URL for resolving relative refs */
  baseUrl?: string;
  /** Warnings accumulated during parsing */
  warnings: string[];
}

export interface ParseResult {
  spec: ApiSpec;
  warnings: string[];
}

/**
 * Check if a $ref is an external reference (URL or relative path)
 */
function isExternalRef(ref: string): boolean {
  // Local JSON pointer refs start with #
  if (ref.startsWith('#')) {
    return false;
  }
  // Absolute URLs
  if (ref.startsWith('http://') || ref.startsWith('https://')) {
    return true;
  }
  // Relative paths (anything else that's not a local ref)
  return true;
}

/**
 * Parse an external $ref into its URL and JSON pointer parts
 * Examples:
 *   "https://example.com/schema.json" -> { url: "https://example.com/schema.json", pointer: undefined }
 *   "https://example.com/schema.json#/definitions/Pet" -> { url: "https://example.com/schema.json", pointer: "#/definitions/Pet" }
 *   "./common.yaml#/components/schemas/Error" -> { url: "./common.yaml", pointer: "#/components/schemas/Error" }
 */
function parseExternalRef(ref: string): { url: string; pointer?: string } {
  const hashIndex = ref.indexOf('#');
  if (hashIndex === -1) {
    return { url: ref };
  }
  if (hashIndex === 0) {
    // This is a local ref, not external
    return { url: '', pointer: ref };
  }
  return {
    url: ref.slice(0, hashIndex),
    pointer: ref.slice(hashIndex),
  };
}

/**
 * Resolve a relative URL against a base URL
 * Returns undefined if the URL cannot be resolved
 */
function resolveUrl(relativeUrl: string, baseUrl?: string): string | undefined {
  // Absolute URLs don't need resolution
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }

  // Cannot resolve relative URL without a base
  if (!baseUrl) {
    return undefined;
  }

  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return undefined;
  }
}

/**
 * Fetch an external document, with caching
 *
 * NOTE: External refs may fail due to CORS restrictions when running in the browser.
 * The server hosting the external document must include appropriate CORS headers
 * (Access-Control-Allow-Origin) for the fetch to succeed.
 */
async function fetchExternalDocument(
  url: string,
  cache: ExternalDocCache,
  warnings: string[],
): Promise<object | undefined> {
  // Check cache first
  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      warnings.push(
        `Failed to fetch external ref ${url}: ${response.status} ${response.statusText}`,
      );
      return undefined;
    }
    const text = await response.text();
    const doc = parseContent(text);
    cache.set(url, doc);
    return doc;
  } catch (error) {
    // Network errors, CORS issues, etc.
    const message = error instanceof Error ? error.message : 'Unknown error';
    warnings.push(`Failed to fetch external ref ${url}: ${message}`);
    return undefined;
  }
}

/**
 * Parse content as JSON or YAML
 */
function parseContent(text: string): object {
  const trimmed = text.trim();

  // Try JSON first if it looks like JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(text);
    } catch {
      // Fall through to YAML
    }
  }

  // Parse as YAML (also handles JSON)
  return parseYaml(text) as object;
}

/**
 * Fetch a spec from a URL using browser's fetch API
 */
async function fetchSpec(url: string): Promise<object> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  try {
    return parseContent(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown parse error';
    throw new Error(`Failed to parse spec from ${url}: ${message}`);
  }
}

/**
 * Resolve a JSON pointer reference within a document
 * @param doc - The document to resolve the ref in
 * @param pointer - A JSON pointer (e.g., "#/components/schemas/Pet" or just "#/")
 */
function resolveLocalRef(doc: object, pointer: string): unknown {
  // Handle empty pointer or just "#"
  if (!pointer || pointer === '#' || pointer === '#/') {
    return doc;
  }

  if (!pointer.startsWith('#/')) {
    // Not a valid local JSON pointer
    return undefined;
  }

  const path = pointer.slice(2).split('/');
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
 * Recursively dereference all $ref pointers in an object (async, supports external refs)
 *
 * This function handles:
 * - Local JSON pointer refs (#/path/to/component)
 * - External URL refs (https://example.com/schema.json)
 * - External URL refs with JSON pointers (https://example.com/schema.json#/definitions/Pet)
 * - Relative path refs (./common.yaml#/components/schemas/Error)
 *
 * NOTE: External refs may fail due to CORS restrictions. When this happens,
 * the ref is kept as-is and a warning is added to the context.
 */
async function dereferenceObjectAsync(
  obj: unknown,
  ctx: DereferenceContext,
  currentBaseUrl?: string,
): Promise<unknown> {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => dereferenceObjectAsync(item, ctx, currentBaseUrl)));
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const record = obj as Record<string, unknown>;

  // Check for $ref
  if ('$ref' in record && typeof record.$ref === 'string') {
    const ref = record.$ref;

    // Create a unique key for this ref in the context of its base URL
    const refKey = currentBaseUrl ? `${currentBaseUrl}::${ref}` : ref;

    // Prevent infinite loops
    if (ctx.resolving.has(refKey)) {
      return { ...record, $ref: ref }; // Keep circular ref as-is
    }

    // Handle local refs
    if (ref.startsWith('#')) {
      const resolved = resolveLocalRef(ctx.root, ref);
      if (resolved !== undefined) {
        ctx.resolving.add(refKey);
        const result = await dereferenceObjectAsync(resolved, ctx, currentBaseUrl);
        ctx.resolving.delete(refKey);
        return result;
      }
      return record;
    }

    // Handle external refs
    if (isExternalRef(ref)) {
      const { url: refUrl, pointer } = parseExternalRef(ref);

      // Resolve the URL (may be relative)
      const baseForResolution = currentBaseUrl || ctx.baseUrl;
      const absoluteUrl = resolveUrl(refUrl, baseForResolution);

      if (!absoluteUrl) {
        ctx.warnings.push(`Cannot resolve relative external ref "${ref}" without a base URL`);
        return record;
      }

      ctx.resolving.add(refKey);

      // Fetch the external document
      const externalDoc = await fetchExternalDocument(absoluteUrl, ctx.externalCache, ctx.warnings);

      if (!externalDoc) {
        ctx.resolving.delete(refKey);
        return record; // Keep ref as-is if fetch failed
      }

      // Resolve the pointer within the external document (or use the whole doc)
      let resolved: unknown = externalDoc;
      if (pointer) {
        resolved = resolveLocalRef(externalDoc, pointer);
        if (resolved === undefined) {
          ctx.warnings.push(
            `Could not resolve pointer "${pointer}" in external document ${absoluteUrl}`,
          );
          ctx.resolving.delete(refKey);
          return record;
        }
      }

      // Recursively dereference the resolved object, using the external doc's URL as the new base
      const result = await dereferenceObjectAsync(
        resolved,
        {
          ...ctx,
          root: externalDoc, // The external doc becomes the new root for local refs
        },
        absoluteUrl,
      );

      ctx.resolving.delete(refKey);
      return result;
    }

    // Unknown ref type, return as-is
    return record;
  }

  // Recursively process all properties
  const result: Record<string, unknown> = {};
  const entries = Object.entries(record);

  for (const [key, value] of entries) {
    result[key] = await dereferenceObjectAsync(value, ctx, currentBaseUrl);
  }

  return result;
}

/**
 * Parse an OpenAPI specification from a URL or object
 *
 * Supports external $ref resolution:
 * - Absolute URLs (https://example.com/schema.json)
 * - Relative paths resolved against the spec URL or baseUrl option
 * - External refs with JSON pointers (https://example.com/schema.json#/definitions/Pet)
 *
 * NOTE: External refs may fail due to CORS restrictions when running in the browser.
 * Failed external refs are kept as-is and warnings are added to the result.
 */
export async function parseOpenApi(
  input: OpenApiInput,
  options: ParseOptions = {},
): Promise<ParseResult> {
  const { dereference: shouldDereference = true, baseUrl } = options;
  const warnings: string[] = [];

  let specObject: object;
  let specBaseUrl: string | undefined = baseUrl;

  // Fetch URL if provided, otherwise use spec object directly
  if (input.url) {
    specObject = await fetchSpec(input.url);
    // Use the spec URL as the base URL for resolving relative refs if no baseUrl provided
    if (!specBaseUrl) {
      specBaseUrl = input.url;
    }
  } else if (input.spec) {
    specObject = input.spec as object;
  } else {
    throw new Error('Either url or spec must be provided');
  }

  try {
    let doc: OpenAPIDocument;

    if (shouldDereference) {
      // Create dereferencing context for async resolution with external ref support
      const ctx: DereferenceContext = {
        root: specObject,
        externalCache: new Map(),
        resolving: new Set(),
        baseUrl: specBaseUrl,
        warnings,
      };

      // Dereference $refs using async implementation that supports external refs
      doc = (await dereferenceObjectAsync(specObject, ctx)) as OpenAPIDocument;
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
  let spec: object;
  try {
    spec = parseContent(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown parse error';
    throw new Error(`Failed to parse spec content: ${message}`);
  }
  return parseOpenApi({ type: 'openapi', spec }, options);
}
