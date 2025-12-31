/**
 * Code generation types
 */

import type { RequestConfig } from '../types';

/**
 * Supported programming languages for code generation
 */
export type CodeLanguage = 'curl' | 'javascript' | 'python' | 'go';

/**
 * Code generation options
 */
export interface CodeGenOptions {
  /** Pretty print / format the output */
  prettyPrint?: boolean;
}

/**
 * Code generator interface
 */
export interface CodeGenerator {
  /** Language identifier */
  language: CodeLanguage;
  /** Display name for the language */
  displayName: string;
  /** File extension */
  extension: string;
  /** Generate code from a request config */
  generate(request: RequestConfig, options?: CodeGenOptions): string;
}

/**
 * Generated code result
 */
export interface GeneratedCode {
  language: CodeLanguage;
  displayName: string;
  code: string;
  extension: string;
}
