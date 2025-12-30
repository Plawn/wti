import type { SecurityRequirement } from '@wti/core';
import { type Component, For, Show, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { Select } from '../../shared';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormField } from './AuthFormField';

interface ApiKeyFormProps {
  authStore: AuthStore;
  securitySchemes: Record<string, SecurityRequirement>;
}

export const ApiKeyForm: Component<ApiKeyFormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'apiKey');

  const apiKeySchemes = () => {
    const schemes: Array<{ name: string; in: 'header' | 'query' | 'cookie' }> = [];
    for (const [name, scheme] of Object.entries(props.securitySchemes)) {
      if (scheme.type === 'apiKey' && scheme.in) {
        schemes.push({ name: scheme.name || name, in: scheme.in });
      }
    }
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

      <AuthFormField
        id="auth-apikey-value"
        label={t('auth.apiKey')}
        type="password"
        value={existingConfig()?.value || apiKeyValue()}
        onInput={setApiKeyValue}
        placeholder="Enter API key..."
      />

      <AuthFormActions
        onAuthorize={handleAuthorize}
        onLogout={handleLogout}
        isAuthorized={() => !!existingConfig()}
      />
    </div>
  );
};
