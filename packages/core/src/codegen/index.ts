/**
 * Code generation module
 *
 * Provides a protocol-agnostic API for generating code snippets.
 * Supports multiple protocols (HTTP, gRPC) with extensible architecture.
 *
 * @example
 * // Get available languages for a protocol
 * const languages = getLanguages('grpc');
 *
 * // Generate code
 * const result = generateCode('grpcurl', {
 *   protocol: 'grpc',
 *   config: { endpoint: 'localhost:50051', ... }
 * });
 */

// Re-export types
export type {
  CodeGenOptions,
  CodeGenRequest,
  GeneratedCode,
  Generator,
  GraphqlRequestConfig,
  GrpcRequestConfig,
  HttpRequestConfig,
  Language,
  LanguageInfo,
  Protocol,
  ProtocolConfigMap,
  // Legacy exports for backwards compatibility
  CodeGenerator,
  CodeLanguage,
  GrpcCodeGenerator,
  GrpcCodeLanguage,
} from './types';

export { createCodeGenRequest } from './types';

import type {
  CodeGenOptions,
  CodeGenRequest,
  GeneratedCode,
  Generator,
  GraphqlRequestConfig,
  GrpcRequestConfig,
  HttpRequestConfig,
  LanguageInfo,
  Protocol,
} from './types';

// Import generators
import { curlGenerator } from './curl';
import { goGenerator } from './go';
import { graphqlCurlGenerator } from './graphql-curl';
import { graphqlGoGenerator } from './graphql-go';
import { graphqlJavascriptGenerator } from './graphql-javascript';
import { graphqlPythonGenerator } from './graphql-python';
import { grpcGoGenerator } from './grpc-go';
import { grpcJavascriptGenerator } from './grpc-javascript';
import { grpcPythonGenerator } from './grpc-python';
import { grpcurlGenerator } from './grpcurl';
import { javascriptGenerator } from './javascript';
import { pythonGenerator } from './python';

// =============================================================================
// Generator Registry
// =============================================================================

/**
 * HTTP generators registry
 */
const httpGenerators = new Map<string, Generator<HttpRequestConfig>>([
  ['curl', curlGenerator],
  ['javascript', javascriptGenerator],
  ['python', pythonGenerator],
  ['go', goGenerator],
]);

/**
 * gRPC generators registry
 */
const grpcGenerators = new Map<string, Generator<GrpcRequestConfig>>([
  ['grpcurl', grpcurlGenerator],
  ['javascript', grpcJavascriptGenerator],
  ['python', grpcPythonGenerator],
  ['go', grpcGoGenerator],
]);

/**
 * GraphQL generators registry
 */
const graphqlGenerators = new Map<string, Generator<GraphqlRequestConfig>>([
  ['curl', graphqlCurlGenerator],
  ['javascript', graphqlJavascriptGenerator],
  ['python', graphqlPythonGenerator],
  ['go', graphqlGoGenerator],
]);

// =============================================================================
// Internal helpers
// =============================================================================

function getGeneratorInfo(generators: Map<string, Generator<unknown>>): LanguageInfo[] {
  return Array.from(generators.values()).map((g) => ({
    language: g.language,
    displayName: g.displayName,
  }));
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Get available languages for a protocol
 */
export function getLanguages(protocol: Protocol): LanguageInfo[] {
  switch (protocol) {
    case 'http':
      return getGeneratorInfo(httpGenerators as Map<string, Generator<unknown>>);
    case 'grpc':
      return getGeneratorInfo(grpcGenerators as Map<string, Generator<unknown>>);
    case 'graphql':
      return getGeneratorInfo(graphqlGenerators as Map<string, Generator<unknown>>);
    default:
      return [];
  }
}

/**
 * Get all supported protocols
 */
export function getProtocols(): Protocol[] {
  return ['http', 'grpc', 'graphql'];
}

/**
 * Generate code for a given language and request
 *
 * @param language - The target language (e.g., 'curl', 'grpcurl', 'python')
 * @param request - The code generation request with protocol and config
 * @param options - Optional generation options
 * @returns Generated code result
 * @throws Error if language is not supported for the protocol
 */
export function generateCode(
  language: string,
  request: CodeGenRequest,
  options?: CodeGenOptions,
): GeneratedCode {
  // Use discriminated union to properly type the generator lookup
  if (request.protocol === 'http') {
    const generator = httpGenerators.get(language);
    if (!generator) {
      const available = Array.from(httpGenerators.keys()).join(', ');
      throw new Error(
        `Language '${language}' is not supported for protocol 'http'. Available: ${available}`,
      );
    }
    return {
      language: generator.language,
      displayName: generator.displayName,
      code: generator.generate(request.config, options),
      extension: generator.extension,
    };
  }

  if (request.protocol === 'grpc') {
    const generator = grpcGenerators.get(language);
    if (!generator) {
      const available = Array.from(grpcGenerators.keys()).join(', ');
      throw new Error(
        `Language '${language}' is not supported for protocol 'grpc'. Available: ${available}`,
      );
    }
    return {
      language: generator.language,
      displayName: generator.displayName,
      code: generator.generate(request.config, options),
      extension: generator.extension,
    };
  }

  if (request.protocol === 'graphql') {
    const generator = graphqlGenerators.get(language);
    if (!generator) {
      const available = Array.from(graphqlGenerators.keys()).join(', ');
      throw new Error(
        `Language '${language}' is not supported for protocol 'graphql'. Available: ${available}`,
      );
    }
    return {
      language: generator.language,
      displayName: generator.displayName,
      code: generator.generate(request.config, options),
      extension: generator.extension,
    };
  }

  // Exhaustive check
  const _exhaustive: never = request;
  throw new Error(`Unknown protocol: ${(_exhaustive as CodeGenRequest).protocol}`);
}

/**
 * Check if a language is supported for a protocol
 */
export function isLanguageSupported(protocol: Protocol, language: string): boolean {
  switch (protocol) {
    case 'http':
      return httpGenerators.has(language);
    case 'grpc':
      return grpcGenerators.has(language);
    case 'graphql':
      return graphqlGenerators.has(language);
    default:
      return false;
  }
}

/**
 * Get default language for a protocol
 */
export function getDefaultLanguage(protocol: Protocol): string {
  switch (protocol) {
    case 'http':
      return 'curl';
    case 'grpc':
      return 'grpcurl';
    case 'graphql':
      return 'curl';
    default:
      return 'curl';
  }
}

// =============================================================================
// Legacy API (backwards compatibility)
// =============================================================================

/**
 * @deprecated Use getLanguages('http') instead
 */
export function getAvailableLanguages(): LanguageInfo[] {
  return getLanguages('http');
}

/**
 * @deprecated Use getLanguages('grpc') instead
 */
export function getAvailableGrpcLanguages(): LanguageInfo[] {
  return getLanguages('grpc');
}

/**
 * @deprecated Use generateCode(language, { protocol: 'grpc', config }) instead
 */
export function generateGrpcCode(
  language: string,
  config: GrpcRequestConfig,
  options?: CodeGenOptions,
): GeneratedCode {
  return generateCode(language, { protocol: 'grpc', config }, options);
}
