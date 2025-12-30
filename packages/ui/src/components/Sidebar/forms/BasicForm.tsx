import { type Component, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormField } from './AuthFormField';

interface BasicFormProps {
  authStore: AuthStore;
}

export const BasicForm: Component<BasicFormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'basic');
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');

  const handleAuthorize = () => {
    if (username()) {
      props.authStore.actions.setBasicAuth(username(), password());
    }
  };

  const handleLogout = () => {
    props.authStore.actions.clearAuth('basic');
    setUsername('');
    setPassword('');
  };

  return (
    <div class="space-y-3">
      <AuthFormField
        id="auth-basic-username"
        label={t('auth.username')}
        type="text"
        value={existingConfig()?.username || username()}
        onInput={setUsername}
        placeholder="Enter username..."
      />
      <AuthFormField
        id="auth-basic-password"
        label={t('auth.password')}
        type="password"
        value={existingConfig()?.password || password()}
        onInput={setPassword}
        placeholder="Enter password..."
      />
      <AuthFormActions
        onAuthorize={handleAuthorize}
        onLogout={handleLogout}
        isAuthorized={() => !!existingConfig()}
      />
    </div>
  );
};
