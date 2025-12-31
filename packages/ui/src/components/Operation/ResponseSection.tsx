import type { ResponseData } from '@wti/core';
import { type Component, Show, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';
import { getStatusColorConfig } from '../../utils';
import { CodeBlock, JsonViewer, Tabs } from '../shared';
import { ResponseHeaders } from './ResponseHeaders';

const COPY_FEEDBACK_DURATION_MS = 2000;

interface ResponseSectionProps {
  response: ResponseData;
}

export const ResponseSection: Component<ResponseSectionProps> = (props) => {
  const { t } = useI18n();
  const [copied, setCopied] = createSignal(false);

  const copyResponse = async () => {
    const text =
      typeof props.response.body === 'object'
        ? JSON.stringify(props.response.body, null, 2)
        : props.response.bodyText;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
    } catch {
      // Clipboard API may fail in insecure contexts or without permissions
      // Silently fail - user can manually copy
    }
  };

  const statusConfig = () => getStatusColorConfig(props.response.status);
  const isJsonResponse = () =>
    typeof props.response.body === 'object' && props.response.body !== null;

  const tabItems = () => [
    {
      id: 'body',
      label: 'Response Body',
      content: (
        <div class="glass-card rounded-2xl overflow-hidden mt-2">
          {isJsonResponse() ? (
            <JsonViewer data={props.response.body} initialExpandDepth={3} maxHeight="none" />
          ) : (
            <CodeBlock code={props.response.bodyText} language="json" />
          )}
        </div>
      ),
    },
    {
      id: 'headers',
      label: 'Headers',
      badge: Object.keys(props.response.headers).length,
      content: (
        <div class="mt-2">
          <ResponseHeaders headers={props.response.headers} />
        </div>
      ),
    },
  ];

  return (
    <div class="mt-4 md:mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
        <div class="flex flex-wrap items-center gap-2 sm:gap-4">
          <span
            class={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-sm ${statusConfig().bg} ${statusConfig().text}`}
          >
            {props.response.status} {props.response.statusText}
          </span>
          <div class="flex items-center gap-2 text-xs sm:text-sm text-surface-700 dark:text-surface-400 font-bold glass-button px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl">
            <svg
              class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {Math.round(props.response.timing.duration)}ms
          </div>
        </div>
        <button
          type="button"
          onClick={copyResponse}
          class="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-bold text-surface-800 dark:text-surface-300 hover:text-surface-950 dark:hover:text-white glass-button rounded-xl transition-all"
          aria-label={copied() ? t('common.copied') : t('common.copy')}
        >
          <Show
            when={copied()}
            fallback={
              <>
                <svg
                  class="w-5 h-5 sm:w-4 sm:h-4"
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
              class="w-5 h-5 sm:w-4 sm:h-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span class="hidden sm:inline text-emerald-600 dark:text-emerald-400">
              {t('common.copied')}
            </span>
          </Show>
        </button>
      </div>

      <Tabs items={tabItems()} />
    </div>
  );
};
