import type { SecurityRequirement } from '@wti/core';
import { type Component, Show, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';
import type { AuthStore } from '../../stores';
import { SegmentedControl } from '../shared';
import { ApiKeyForm, BasicForm, BearerForm, OAuth2Form, OpenIdForm } from './forms';

interface AuthPanelProps {
  authStore: AuthStore;
  securitySchemes: Record<string, SecurityRequirement>;
}

type AuthTab = 'apiKey' | 'bearer' | 'basic' | 'oauth2' | 'openid';

export const AuthPanel: Component<AuthPanelProps> = (props) => {
  const { t } = useI18n();

  // Determine available auth types from security schemes
  const availableAuthTypes = () => {
    const types = new Set<AuthTab>();
    for (const scheme of Object.values(props.securitySchemes)) {
      if (scheme.type === 'apiKey') {
        types.add('apiKey');
      }
      if (scheme.type === 'bearer') {
        types.add('bearer');
      }
      if (scheme.type === 'basic') {
        types.add('basic');
      }
      if (scheme.type === 'oauth2') {
        types.add('oauth2');
      }
      if (scheme.type === 'openIdConnect') {
        types.add('openid');
      }
    }
    // If no schemes defined, show all types
    if (types.size === 0) {
      return ['apiKey', 'bearer', 'basic', 'oauth2', 'openid'] as AuthTab[];
    }
    return Array.from(types);
  };

  const [activeTab, setActiveTab] = createSignal<AuthTab>(availableAuthTypes()[0] || 'apiKey');
  const [expanded, setExpanded] = createSignal(false);

  // Check if any auth is configured
  const hasAnyAuth = () => {
    const configs = props.authStore.state.configs;
    return Object.keys(configs).some((key) => configs[key] !== undefined);
  };

  const getAuthStatus = () => {
    if (hasAnyAuth()) {
      return {
        text: t('auth.configured'),
        class: 'text-emerald-700 dark:text-emerald-400',
        dot: 'bg-emerald-500',
      };
    }
    return {
      text: t('auth.notConfigured'),
      class: 'text-surface-700 dark:text-surface-400',
      dot: 'bg-surface-600 dark:bg-surface-500',
    };
  };

  const getTabLabel = (authType: AuthTab): string => {
    const labels: Record<AuthTab, string> = {
      apiKey: t('auth.apiKey'),
      bearer: t('auth.bearer'),
      basic: t('auth.basic'),
      oauth2: t('auth.oauth2'),
      openid: t('auth.openid'),
    };
    return labels[authType];
  };

  return (
    <div class="px-3 md:px-4 py-1.5 md:py-2">
      {/* Header - clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded())}
        class="w-full flex items-center justify-between py-1 group"
      >
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold text-surface-700 dark:text-surface-400 uppercase tracking-wider">
            {t('auth.title')}
          </h3>
          <span class={`w-1.5 h-1.5 rounded-full ${getAuthStatus().dot}`} />
        </div>
        <svg
          class={`w-3.5 h-3.5 text-surface-600 transition-transform ${expanded() ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded content */}
      <Show when={expanded()}>
        <div class="mt-2 space-y-3">
          {/* Auth type tabs */}
          <SegmentedControl
            value={activeTab()}
            onChange={(val) => setActiveTab(val as AuthTab)}
            options={availableAuthTypes().map((type) => ({
              value: type,
              label: getTabLabel(type),
            }))}
            className="w-full"
            size="sm"
          />

          {/* Auth forms */}
          <Show when={activeTab() === 'apiKey'}>
            <ApiKeyForm authStore={props.authStore} securitySchemes={props.securitySchemes} />
          </Show>
          <Show when={activeTab() === 'bearer'}>
            <BearerForm authStore={props.authStore} />
          </Show>
          <Show when={activeTab() === 'basic'}>
            <BasicForm authStore={props.authStore} />
          </Show>
          <Show when={activeTab() === 'oauth2'}>
            <OAuth2Form authStore={props.authStore} />
          </Show>
          <Show when={activeTab() === 'openid'}>
            <OpenIdForm authStore={props.authStore} securitySchemes={props.securitySchemes} />
          </Show>
        </div>
      </Show>
    </div>
  );
};
