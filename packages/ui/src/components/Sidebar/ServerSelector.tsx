import type { Server } from '@wti/core';
import { type Component, For, Show } from 'solid-js';
import { useI18n } from '../../i18n';
import { Select } from '../shared';

interface ServerSelectorProps {
  servers: Server[];
  selectedUrl: string | null;
  onChange: (server: Server) => void;
}

export const ServerSelector: Component<ServerSelectorProps> = (props) => {
  const { t } = useI18n();

  const handleChange = (url: string) => {
    const server = props.servers.find((s) => s.url === url);
    if (server) {
      props.onChange(server);
    }
  };

  return (
    <Show when={props.servers.length > 0}>
      <div>
        <label
          class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
          for="server-selector"
        >
          {t('sidebar.servers')}
        </label>
        <Select id="server-selector" value={props.selectedUrl || ''} onChange={handleChange}>
          <For each={props.servers}>
            {(server) => <option value={server.url}>{server.description || server.url}</option>}
          </For>
        </Select>
      </div>
    </Show>
  );
};
