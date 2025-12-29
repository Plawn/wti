/**
 * Code generation module
 *
 * Generates code snippets in multiple languages from request configurations
 */

export type { CodeGenOptions, CodeLanguage, GeneratedCode } from './types';

import type { RequestConfig } from '../types';
import { curlGenerator } from './curl';
import { goGenerator } from './go';
import { javascriptGenerator } from './javascript';
import { pythonGenerator } from './python';
import type { CodeGenOptions, CodeGenerator, CodeLanguage, GeneratedCode } from './types';

/**
 * All available code generators (internal)
 */
const generators: Record<CodeLanguage, CodeGenerator> = {
  curl: curlGenerator,
  javascript: javascriptGenerator,
  python: pythonGenerator,
  go: goGenerator,
};

/**
 * Get list of all available languages
 */
export function getAvailableLanguages(): Array<{ language: CodeLanguage; displayName: string }> {
  return Object.values(generators).map((g) => ({
    language: g.language,
    displayName: g.displayName,
  }));
}

/**
 * Generate code for a specific language
 */
export function generateCode(
  language: CodeLanguage,
  request: RequestConfig,
  options?: CodeGenOptions,
): GeneratedCode {
  const generator = generators[language];
  if (!generator) {
    throw new Error(`Unknown language: ${language}`);
  }

  return {
    language: generator.language,
    displayName: generator.displayName,
    code: generator.generate(request, options),
    extension: generator.extension,
  };
}
