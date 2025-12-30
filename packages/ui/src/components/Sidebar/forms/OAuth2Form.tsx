import { type Component, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormField } from './AuthFormField';

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
      <AuthFormField
        id="auth-oauth2-token"
        label={t('auth.token')}
        type="password"
        value={existingConfig()?.accessToken || accessToken()}
        onInput={setAccessToken}
        placeholder="Enter access token..."
        hint={
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Paste your OAuth2 access token obtained from your identity provider
          </p>
        }
      />
      <AuthFormActions
        onAuthorize={handleAuthorize}
        onLogout={handleLogout}
        isAuthorized={() => !!existingConfig()}
      />
    </div>
  );
};
