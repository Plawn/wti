import { type Component, Show, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { Button, Input } from '../../shared';

interface OAuth2FormProps {
  authStore: AuthStore;
}

export const OAuth2Form: Component<OAuth2FormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'oauth2');
  const [accessToken, setAccessToken] = createSignal('');

  const handleAuthorize = () => {
    if (accessToken()) {
      props.authStore.actions.setOAuth2Token(accessToken());
    }
  };

  const handleLogout = () => {
    props.authStore.actions.clearAuth('oauth2');
    setAccessToken('');
  };

  return (
    <div class="space-y-3">
      <div>
        <label
          for="auth-oauth2-token"
          class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
        >
          {t('auth.token')}
        </label>
        <Input
          id="auth-oauth2-token"
          type="password"
          value={existingConfig()?.accessToken || accessToken()}
          onInput={setAccessToken}
          placeholder="Enter access token..."
        />
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Paste your OAuth2 access token obtained from your identity provider
        </p>
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
