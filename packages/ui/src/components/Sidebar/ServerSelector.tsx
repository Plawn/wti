import type { Server } from '@wti/core';
import { type Component, For, Show } from 'solid-js';
import { useI18n } from '../../i18n';

interface ServerSelectorProps {
  servers: Server[];
  selectedUrl: string | null;
  onChange: (server: Server) => void;
}

export const ServerSelector: Component<ServerSelectorProps> = (props) => {
  const { t } = useI18n();

  const handleChange = (e: Event) => {
    const url = (e.target as HTMLSelectElement).value;
    const server = props.servers.find((s) => s.url === url);
    if (server) {
      props.onChange(server);
    }
  };

  return (
    <Show when={props.servers.length > 0}>
      <div>
        <label
          class="block text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5"
          for="server-selector"
        >
          {t('sidebar.servers')}
        </label>
        <div class="relative">
          <select
            id="server-selector"
            class="w-full px-3.5 py-2.5 bg-gray-100/80 dark:bg-gray-800/80 border-0 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 cursor-pointer appearance-none pr-10"
            value={props.selectedUrl || ''}
            onChange={handleChange}
          >
            <For each={props.servers}>
              {(server) => (
                <option value={server.url}>
                  {server.description ? `${server.description}` : server.url}
                </option>
              )}
            </For>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Show>
  );
};
