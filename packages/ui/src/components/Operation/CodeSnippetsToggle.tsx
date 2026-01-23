/**
 * Code Snippets Toggle
 *
 * Collapsible section for code snippets.
 * Protocol-agnostic: works with any CodeGenRequest.
 */

import type { CodeGenRequest } from '@wti/core';
import { type Component, Show } from 'solid-js';
import { useI18n } from '../../i18n';
import { CodeSnippets } from './CodeSnippets';

export interface CodeSnippetsToggleProps {
  show: boolean;
  onToggle: () => void;
  /** Code generation request (null if config is invalid/incomplete) */
  request: CodeGenRequest | null;
}

export const CodeSnippetsToggle: Component<CodeSnippetsToggleProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="mt-3 md:mt-4">
      <button
        type="button"
        onClick={props.onToggle}
        class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <svg
          class={`w-3.5 h-3.5 transition-transform ${props.show ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {t('codegen.title')}
      </button>
      <Show when={props.show && props.request} keyed>
        {(request) => (
          <div class="mt-3">
            <CodeSnippets request={request} />
          </div>
        )}
      </Show>
    </div>
  );
};
