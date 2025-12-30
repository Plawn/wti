import type { Accessor, Component } from 'solid-js';
import { Show } from 'solid-js';
import { useI18n } from '../../../i18n';
import { Button } from '../../shared';

export interface AuthFormActionsProps {
  onAuthorize: () => void;
  onLogout: () => void;
  isAuthorized: Accessor<boolean>;
}

export const AuthFormActions: Component<AuthFormActionsProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="flex gap-2">
      <Button onClick={props.onAuthorize} class="flex-1 py-2 text-sm">
        {t('auth.authorize')}
      </Button>
      <Show when={props.isAuthorized()}>
        <Button onClick={props.onLogout} variant="secondary" class="py-2 text-sm">
          {t('auth.logout')}
        </Button>
      </Show>
    </div>
  );
};
