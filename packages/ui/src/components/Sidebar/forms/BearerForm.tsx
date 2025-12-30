import { type Component, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormField } from './AuthFormField';

interface BearerFormProps {
  authStore: AuthStore;
}

export const BearerForm: Component<BearerFormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'bearer');
  const [token, setToken] = createSignal('');

  const handleAuthorize = () => {
    if (token()) {
      props.authStore.actions.setBearerToken(token());
    }
  };

  const handleLogout = () => {
    props.authStore.actions.clearAuth('bearer');
    setToken('');
  };

  return (
    <div class="space-y-3">
      <AuthFormField
        id="auth-bearer-token"
        label={t('auth.token')}
        type="password"
        value={existingConfig()?.token || token()}
        onInput={setToken}
        placeholder="Enter bearer token..."
      />
      <AuthFormActions
        onAuthorize={handleAuthorize}
        onLogout={handleLogout}
        isAuthorized={() => !!existingConfig()}
      />
    </div>
  );
};
