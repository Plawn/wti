import type { Operation } from '@wti/core';
import { type Component, For, Show, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';
import { copyShareableUrl } from '../../utils/url';
import { Markdown } from '../shared';

interface OperationHeaderProps {
  operation: Operation;
}

const methodConfig: Record<string, { bg: string; glow: string }> = {
  get: { bg: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/20' },
  post: { bg: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/20' },
  put: { bg: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
  patch: { bg: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20' },
  delete: { bg: 'from-rose-500 to-red-600', glow: 'shadow-rose-500/20' },
  head: { bg: 'from-cyan-500 to-teal-600', glow: 'shadow-cyan-500/20' },
  options: { bg: 'from-gray-500 to-slate-600', glow: 'shadow-gray-500/20' },
  grpc: { bg: 'from-indigo-500 to-purple-600', glow: 'shadow-indigo-500/20' },
};

const defaultConfig = { bg: 'from-gray-500 to-slate-600', glow: 'shadow-gray-500/20' };

export const OperationHeader: Component<OperationHeaderProps> = (props) => {
  const { t } = useI18n();
  const config = () => methodConfig[props.operation.method.toLowerCase()] || defaultConfig;
  const [copied, setCopied] = createSignal(false);

  const handleCopyLink = async () => {
    await copyShareableUrl(props.operation.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="mb-16">
      {/* Method and Path */}
      <div class="flex items-start gap-4 mb-8">
        <span
          class={`bg-gradient-to-r ${config().bg} text-white text-sm font-bold uppercase min-w-[80px] py-2.5 rounded-2xl shadow-lg ${config().glow} flex items-center justify-center`}
        >
          {props.operation.method}
        </span>
        <div class="flex-1 min-w-0 pt-1.5 flex items-center gap-3">
          <code class="text-lg font-mono text-gray-800 dark:text-gray-100 break-all leading-relaxed font-medium">
            {props.operation.path}
          </code>
          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            class="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            title={t('common.copyLink')}
          >
            <Show
              when={!copied()}
              fallback={
                <svg
                  class="w-4 h-4 text-emerald-500"
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
              }
            >
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </Show>
          </button>
        </div>
      </div>

      {/* Summary */}
      <Show when={props.operation.summary}>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {props.operation.summary}
        </h2>
      </Show>

      {/* Description */}
      <Show when={props.operation.description}>
        <Markdown content={props.operation.description} class="max-w-3xl" />
      </Show>

      {/* Tags and badges */}
      <div class="flex flex-wrap items-center gap-2.5 mt-6">
        <Show when={props.operation.deprecated}>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {t('common.deprecated')}
          </span>
        </Show>

        <Show when={props.operation.tags.length > 0}>
          <For each={props.operation.tags}>
            {(tag) => (
              <span class="px-3.5 py-1.5 glass-button text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full capitalize">
                {tag}
              </span>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};
