import { type Component, Show, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { Button, Input } from '../../shared';

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
      <div>
        <label
          for="auth-basic-username"
          class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
        >
          {t('auth.username')}
        </label>
        <Input
          id="auth-basic-username"
          type="text"
          value={existingConfig()?.username || username()}
          onInput={setUsername}
          placeholder="Enter username..."
        />
      </div>

      <div>
        <label
          for="auth-basic-password"
          class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
        >
          {t('auth.password')}
        </label>
        <Input
          id="auth-basic-password"
          type="password"
          value={existingConfig()?.password || password()}
          onInput={setPassword}
          placeholder="Enter password..."
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
