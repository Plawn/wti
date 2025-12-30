import type { SecurityRequirement } from '@wti/core';
import { type Component, For, Show, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';
import type { AuthStore } from '../../stores';
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
      if (scheme.type === 'apiKey') types.add('apiKey');
      if (scheme.type === 'bearer') types.add('bearer');
      if (scheme.type === 'basic') types.add('basic');
      if (scheme.type === 'oauth2') types.add('oauth2');
      if (scheme.type === 'openIdConnect') types.add('openid');
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
        class: 'text-emerald-600 dark:text-emerald-400',
        dot: 'bg-emerald-500',
      };
    }
    return {
      text: t('auth.notConfigured'),
      class: 'text-gray-500 dark:text-gray-400',
      dot: 'bg-gray-400 dark:bg-gray-500',
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
    <div class="px-3 md:px-4 py-2 md:py-3">
      {/* Header - clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded())}
        class="w-full flex items-center justify-between group"
      >
        <div class="flex items-center gap-2.5 md:gap-3">
          <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg
              class="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div class="text-left">
            <h3 class="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">{t('auth.title')}</h3>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class={`w-1.5 h-1.5 rounded-full ${getAuthStatus().dot}`} />
              <span class={`text-[11px] md:text-xs ${getAuthStatus().class}`}>{getAuthStatus().text}</span>
            </div>
          </div>
        </div>
        <svg
          class={`w-4 h-4 text-gray-400 transition-transform ${expanded() ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded content */}
      <Show when={expanded()}>
        <div class="mt-3 space-y-3">
          {/* Auth type tabs */}
          <div class="flex gap-1 p-1 glass-input rounded-xl">
            <For each={availableAuthTypes()}>
              {(authType) => (
                <button
                  type="button"
                  onClick={() => setActiveTab(authType)}
                  class={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab() === authType
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {getTabLabel(authType)}
                </button>
              )}
            </For>
          </div>

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
            <OpenIdForm authStore={props.authStore} />
          </Show>
        </div>
      </Show>
    </div>
  );
};
