import { type Component, Show, createSignal } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { Button, Input } from '../../shared';

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
      <div>
        <label
          for="auth-bearer-token"
          class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
        >
          {t('auth.token')}
        </label>
        <Input
          id="auth-bearer-token"
          type="password"
          value={existingConfig()?.token || token()}
          onInput={setToken}
          placeholder="Enter bearer token..."
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
