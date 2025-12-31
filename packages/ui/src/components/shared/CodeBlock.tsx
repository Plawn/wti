import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { type Component, Show, createMemo } from 'solid-js';
import { useCopyToClipboard } from '../../hooks';
import { useI18n } from '../../i18n';

export interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: string;
  wrap?: boolean;
  hideCopyButton?: boolean;
}

export const CodeBlock: Component<CodeBlockProps> = (props) => {
  const { t } = useI18n();
  const { copied, copy } = useCopyToClipboard();
  let codeRef: HTMLElement | undefined;

  const language = () => props.language || 'json';
  const maxHeight = () => props.maxHeight || '31.25rem';

  // Highlight code whenever it changes
  const highlightedCode = createMemo(() => {
    const code = props.code;
    const lang = language();

    // Get the grammar for the language, fallback to plain text
    const grammar = Prism.languages[lang];
    if (!grammar) {
      return escapeHtml(code);
    }

    // Sanitize Prism output for defense-in-depth (allow span tags for highlighting)
    return DOMPurify.sanitize(Prism.highlight(code, grammar, lang), {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class'],
    });
  });

  return (
    <div class="relative group rounded-xl overflow-hidden">
      {/* Copy button */}
      <Show when={!props.hideCopyButton}>
        <button
          type="button"
          onClick={() => copy(props.code)}
          class="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 glass-button rounded-lg transition-all"
          aria-label={copied() ? t('common.copied') : t('common.copy')}
        >
          <Show
            when={copied()}
            fallback={
              <>
                <svg
                  class="w-4 h-4 sm:w-3.5 sm:h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span class="hidden sm:inline">{t('common.copy')}</span>
              </>
            }
          >
            <svg
              class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span class="hidden sm:inline text-emerald-500 dark:text-emerald-400">
              {t('common.copied')}
            </span>
          </Show>
        </button>
      </Show>

      {/* Language badge */}
      <div class="absolute top-3 left-3 z-10">
        <span class="text-[0.625rem] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
          {language()}
        </span>
      </div>

      {/* Code container with syntax highlighting */}
      {/* innerHTML is the correct SolidJS pattern - content is sanitized via DOMPurify in highlightedCode() */}
      <pre
        class={`p-6 pt-10 text-sm font-mono overflow-auto scrollbar-thin glass-thin ${props.wrap ? 'whitespace-pre-wrap break-all' : ''}`}
        style={{ 'max-height': maxHeight() }}
      >
        <code ref={codeRef} class={`language-${language()}`} innerHTML={highlightedCode()} />
      </pre>
    </div>
  );
};

// Escape HTML to prevent XSS when grammar is not found
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
