import type { Server, ServerVariable } from '@wti/core';
import { type Component, For, Show } from 'solid-js';
import { useI18n } from '../../i18n';
import { Input, Select } from '../shared';
import { Tooltip } from '../shared/Tooltip';

interface ServerSelectorProps {
  servers: Server[];
  selectedUrl: string | null;
  serverVariables: Record<string, string>;
  onChange: (server: Server) => void;
  onVariableChange: (name: string, value: string) => void;
  hideLabel?: boolean;
  className?: string;
}

export const ServerSelector: Component<ServerSelectorProps> = (props) => {
  const { t } = useI18n();

  const handleChange = (url: string) => {
    const server = props.servers.find((s) => s.url === url);
    if (server) {
      props.onChange(server);
    }
  };

  const selectedServer = () => props.servers.find((s) => s.url === props.selectedUrl);

  const hasVariables = () => {
    const server = selectedServer();
    return server?.variables && Object.keys(server.variables).length > 0;
  };

  const variables = () => {
    const server = selectedServer();
    if (!server?.variables) {
      return [];
    }
    return Object.entries(server.variables).map(([name, variable]) => ({
      name,
      ...variable,
    }));
  };

  return (
    <Show when={props.servers.length > 0}>
      <div class={`space-y-3 ${props.className ?? ''}`}>
        <div>
          <Show when={!props.hideLabel}>
            <label
              class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
              for="server-selector"
            >
              {t('sidebar.servers')}
            </label>
          </Show>
          <Select id="server-selector" value={props.selectedUrl || ''} onChange={handleChange}>
            <For each={props.servers}>
              {(server) => <option value={server.url}>{server.description || server.url}</option>}
            </For>
          </Select>
        </div>

        {/* Server Variables */}
        <Show when={hasVariables()}>
          <div class="space-y-2">
            <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">
              {t('sidebar.serverVariables')}
            </span>
            <div class="space-y-2">
              <For each={variables()}>
                {(variable) => (
                  <ServerVariableInput
                    name={variable.name}
                    variable={variable}
                    value={props.serverVariables[variable.name] ?? variable.default}
                    onChange={(value) => props.onVariableChange(variable.name, value)}
                  />
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
};

interface ServerVariableInputProps {
  name: string;
  variable: ServerVariable;
  value: string;
  onChange: (value: string) => void;
}

const ServerVariableInput: Component<ServerVariableInputProps> = (props) => {
  const hasEnum = () => props.variable.enum && props.variable.enum.length > 0;
  const inputId = () => `server-var-${props.name}`;

  const inputElement = () => {
    if (hasEnum()) {
      return (
        <Select id={inputId()} value={props.value} onChange={props.onChange} class="text-xs">
          <For each={props.variable.enum}>
            {(enumValue) => <option value={enumValue}>{enumValue}</option>}
          </For>
        </Select>
      );
    }

    return (
      <Input
        id={inputId()}
        value={props.value}
        onInput={props.onChange}
        placeholder={props.variable.default}
        class="text-xs"
      />
    );
  };

  const labelContent = () => (
    <>
      {'{'}
      {props.name}
      {'}'}
    </>
  );

  return (
    <div class="flex items-center gap-2">
      <Show
        when={props.variable.description}
        fallback={
          <label
            for={inputId()}
            class="text-xs font-mono text-gray-600 dark:text-gray-400 min-w-[3.75rem] shrink-0"
          >
            {labelContent()}
          </label>
        }
      >
        {(description) => (
          <Tooltip content={description()}>
            <label
              for={inputId()}
              class="text-xs font-mono text-gray-600 dark:text-gray-400 min-w-[3.75rem] shrink-0 cursor-help border-b border-dotted border-gray-400 dark:border-gray-500"
            >
              {labelContent()}
            </label>
          </Tooltip>
        )}
      </Show>
      <div class="flex-1">{inputElement()}</div>
    </div>
  );
};
