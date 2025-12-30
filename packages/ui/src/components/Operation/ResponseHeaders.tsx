import { type Component, For, Show, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';

interface ResponseHeadersProps {
  headers: Record<string, string>;
}

export const ResponseHeaders: Component<ResponseHeadersProps> = (props) => {
  const { t } = useI18n();
  const [expanded, setExpanded] = createSignal(true);

  const headerEntries = () => Object.entries(props.headers);
  const headerCount = () => headerEntries().length;
  const hasHeaders = () => headerCount() > 0;

  return (
    <Show when={hasHeaders()}>
      <div class="mt-4 glass-card rounded-xl overflow-hidden">
        {/* Header toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded())}
          class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
        >
          <div class="flex items-center gap-2.5">
            <svg
              class={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${expanded() ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('response.headers')}
            </span>
            <span class="px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-white/5 rounded-md">
              {headerCount()}
            </span>
          </div>
          <svg
            class={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${expanded() ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Headers table */}
        <Show when={expanded()}>
          <div class="border-t border-gray-200 dark:border-white/5 overflow-x-auto">
            <table class="w-full text-sm min-w-[400px]">
              <thead>
                <tr class="bg-gray-50/50 dark:bg-white/[0.02]">
                  <th class="px-3 sm:px-5 py-2 sm:py-2.5 text-left text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">
                    Name
                  </th>
                  <th class="px-3 sm:px-5 py-2 sm:py-2.5 text-left text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100/80 dark:divide-white/5">
                <For each={headerEntries()}>
                  {([name, value]) => (
                    <tr class="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td class="px-3 sm:px-5 py-2.5 sm:py-3 font-mono text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 break-all">
                        {name}
                      </td>
                      <td class="px-3 sm:px-5 py-2.5 sm:py-3 font-mono text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 break-all">
                        {value}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </div>
    </Show>
  );
};
