import type { SecurityRequirement } from '@wti/core';
import { type Component, For, Show, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { Button, Input, Select } from '../../shared';

interface ApiKeyFormProps {
  authStore: AuthStore;
  securitySchemes: Record<string, SecurityRequirement>;
}

export const ApiKeyForm: Component<ApiKeyFormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'apiKey');

  // Get API key schemes from security schemes
  const apiKeySchemes = () => {
    const schemes: Array<{ name: string; in: 'header' | 'query' | 'cookie' }> = [];
    for (const [name, scheme] of Object.entries(props.securitySchemes)) {
      if (scheme.type === 'apiKey' && scheme.in) {
        schemes.push({ name: scheme.name || name, in: scheme.in });
      }
    }
    // Default if none defined
    if (schemes.length === 0) {
      schemes.push({ name: 'X-API-Key', in: 'header' });
    }
    return schemes;
  };

  const [selectedScheme, setSelectedScheme] = createSignal(apiKeySchemes()[0]?.name || 'X-API-Key');
  const [apiKeyValue, setApiKeyValue] = createSignal('');

  const handleAuthorize = () => {
    const scheme = apiKeySchemes().find((s) => s.name === selectedScheme());
    if (scheme && apiKeyValue()) {
      props.authStore.actions.setApiKey(scheme.name, apiKeyValue(), scheme.in);
    }
  };

  const handleLogout = () => {
    props.authStore.actions.clearAuth(selectedScheme());
    setApiKeyValue('');
  };

  return (
    <div class="space-y-3">
      <Show when={apiKeySchemes().length > 1}>
        <div>
          <label
            for="auth-apikey-scheme"
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
          >
            Scheme
          </label>
          <Select id="auth-apikey-scheme" value={selectedScheme()} onChange={setSelectedScheme}>
            <For each={apiKeySchemes()}>
              {(scheme) => (
                <option value={scheme.name}>
                  {scheme.name} ({scheme.in})
                </option>
              )}
            </For>
          </Select>
        </div>
      </Show>

      <div>
        <label
          for="auth-apikey-value"
          class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
        >
          {t('auth.apiKey')}
        </label>
        <Input
          id="auth-apikey-value"
          type="password"
          value={existingConfig()?.value || apiKeyValue()}
          onInput={setApiKeyValue}
          placeholder="Enter API key..."
        />
      </div>

      <div class="flex gap-2">
        <Button onClick={handleAuthorize} class="flex-1 py-2 text-sm">
          {t('auth.authorize')}
        </Button>
        <Show when={existingConfig()}>
          <Button onClick={handleLogout} variant="secondary" class="py-2 text-sm">
            {t('auth.logout')}
          </Button>
        </Show>
      </div>
    </div>
  );
};
