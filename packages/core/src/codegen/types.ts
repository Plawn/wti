/**
 * Code generation types
 *
 * Architecture: Protocol-based registry pattern
 * - Each protocol (http, grpc, etc.) has its own request config
 * - Generators are registered per protocol
 * - Single entry point dispatches based on protocol
 */

import type { RequestConfig } from '../types';

// =============================================================================
// Protocol definitions
// =============================================================================

/**
 * Supported protocols for code generation
 */
export type Protocol = 'http' | 'grpc';

/**
 * Language identifiers
 */
export type Language = string;

// =============================================================================
// Request configurations per protocol
// =============================================================================

/**
 * HTTP request configuration (re-export for convenience)
 */
export type HttpRequestConfig = RequestConfig;

/**
 * gRPC request configuration
 */
export interface GrpcRequestConfig {
  /** gRPC server endpoint (e.g., "localhost:50051") */
  endpoint: string;
  /** Full method path (e.g., "/package.Service/Method") */
  methodPath: string;
  /** Service name for display */
  serviceName: string;
  /** Method name for display */
  methodName: string;
  /** Request message as JSON */
  message: unknown;
  /** Metadata/headers */
  metadata?: Record<string, string>;
  /** Use TLS */
  useTls?: boolean;
}

/**
 * Map of protocol to its request config type
 */
export interface ProtocolConfigMap {
  http: HttpRequestConfig;
  grpc: GrpcRequestConfig;
}

// =============================================================================
// Unified code generation request (discriminated union)
// =============================================================================

/**
 * Code generation request with protocol discriminator
 */
export type CodeGenRequest =
  | { protocol: 'http'; config: HttpRequestConfig }
  | { protocol: 'grpc'; config: GrpcRequestConfig };

/**
 * Helper to create a code gen request
 */
export function createCodeGenRequest<P extends Protocol>(
  protocol: P,
  config: ProtocolConfigMap[P],
): CodeGenRequest {
  return { protocol, config } as CodeGenRequest;
}

// =============================================================================
// Code generation options and results
// =============================================================================

/**
 * Code generation options
 */
export interface CodeGenOptions {
  /** Pretty print / format the output */
  prettyPrint?: boolean;
}

/**
 * Generated code result
 */
export interface GeneratedCode {
  language: Language;
  displayName: string;
  code: string;
  extension: string;
}

/**
 * Language info for UI display
 */
export interface LanguageInfo {
  language: Language;
  displayName: string;
}

// =============================================================================
// Generator interface (protocol-agnostic)
// =============================================================================

/**
 * Code generator interface - generic over config type
 */
export interface Generator<TConfig = unknown> {
  /** Language identifier */
  language: Language;
  /** Display name for the language */
  displayName: string;
  /** File extension */
  extension: string;
  /** Generate code from a request config */
  generate(config: TConfig, options?: CodeGenOptions): string;
}

// =============================================================================
// Legacy type aliases for backwards compatibility
// =============================================================================

/** @deprecated Use Language instead */
export type CodeLanguage = 'curl' | 'javascript' | 'python' | 'go';

/** @deprecated Use Language instead */
export type GrpcCodeLanguage = 'grpcurl' | 'javascript' | 'python' | 'go';

/** @deprecated Use Generator<HttpRequestConfig> instead */
export type CodeGenerator = Generator<HttpRequestConfig>;

/** @deprecated Use Generator<GrpcRequestConfig> instead */
export type GrpcCodeGenerator = Generator<GrpcRequestConfig>;
