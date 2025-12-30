/**
 * Code Snippets Panel
 *
 * Displays generated code snippets in multiple languages
 */

import {
  type CodeLanguage,
  type RequestConfig,
  generateCode,
  getAvailableLanguages,
} from '@wti/core';
import { type Component, For, Show, createMemo, createSignal } from 'solid-js';
import { useCopyToClipboard } from '../../hooks';
import { useI18n } from '../../i18n';
import { CodeBlock } from '../shared';

interface CodeSnippetsProps {
  request: RequestConfig;
}

const LANGUAGES = getAvailableLanguages();

const languageToHighlight = (lang: CodeLanguage): string => {
  switch (lang) {
    case 'curl':
      return 'bash';
    case 'javascript':
      return 'javascript';
    case 'python':
      return 'python';
    case 'go':
      return 'go';
    default:
      return 'plaintext';
  }
};

export const CodeSnippets: Component<CodeSnippetsProps> = (props) => {
  const { t } = useI18n();
  const [selectedLang, setSelectedLang] = createSignal<CodeLanguage>('curl');
  const { copied, copy } = useCopyToClipboard();

  const generatedCode = createMemo(() => {
    try {
      return generateCode(selectedLang(), props.request);
    } catch {
      return null;
    }
  });

  return (
    <div class="glass-card rounded-2xl overflow-hidden">
      {/* Header with language tabs */}
      <div class="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
          <For each={LANGUAGES}>
            {(lang) => (
              <button
                type="button"
                onClick={() => setSelectedLang(lang.language)}
                class={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedLang() === lang.language
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {lang.displayName}
              </button>
            )}
          </For>
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={() => {
            const code = generatedCode();
            if (code) {
              copy(code.code);
            }
          }}
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-button rounded-lg transition-all"
        >
          <Show
            when={copied()}
            fallback={
              <>
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {t('common.copy')}
              </>
            }
          >
            <svg
              class="w-4 h-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {t('common.copied')}
          </Show>
        </button>
      </div>

      {/* Code content */}
      <div class="max-h-96 overflow-auto">
        <Show
          when={generatedCode()}
          fallback={<div class="p-4 text-gray-500">Failed to generate code</div>}
        >
          {(code) => (
            <CodeBlock
              code={code().code}
              language={languageToHighlight(code().language)}
              hideCopyButton
            />
          )}
        </Show>
      </div>
    </div>
  );
};
