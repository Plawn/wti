import type { SecurityRequirement } from '@wti/core';
import { type Component, For, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { useAuthConfig } from '../../hooks';
import { useI18n } from '../../i18n';
import type { AuthStore } from '../../stores';
import { Button, Input, Select } from '../shared';

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

  return (
    <div class="px-5 py-4">
      {/* Header - clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded())}
        class="w-full flex items-center justify-between group"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
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
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{t('auth.title')}</h3>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class={`w-1.5 h-1.5 rounded-full ${getAuthStatus().dot}`} />
              <span class={`text-xs ${getAuthStatus().class}`}>{getAuthStatus().text}</span>
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
        <div class="mt-4 space-y-4">
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
                  {authType === 'apiKey' && t('auth.apiKey')}
                  {authType === 'bearer' && t('auth.bearer')}
                  {authType === 'basic' && t('auth.basic')}
                  {authType === 'oauth2' && t('auth.oauth2')}
                  {authType === 'openid' && t('auth.openid')}
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

// API Key Form
interface ApiKeyFormProps {
  authStore: AuthStore;
  securitySchemes: Record<string, SecurityRequirement>;
}

const ApiKeyForm: Component<ApiKeyFormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'apiKey');

  // Get API key schemes from security schemes
  const apiKeySchemes = () => {
    const schemes: Array<{ name: string; in: 'header' | 'query' | 'cookie' }> = [];
    for (const [name, scheme] of Object.entries(props.securitySchemes)) {
      if (scheme.type === 'apiKey' && scheme.in) {
        schemes.push({ name: scheme.name || name, in: scheme.in });
      }
    }
    // Default if none defined
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

      <div>
        <label
          for="auth-apikey-value"
          class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
        >
          {t('auth.apiKey')}
        </label>
        <Input
          id="auth-apikey-value"
          type="password"
          value={existingConfig()?.value || apiKeyValue()}
          onInput={setApiKeyValue}
          placeholder="Enter API key..."
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

// Bearer Token Form
interface BearerFormProps {
  authStore: AuthStore;
}

const BearerForm: Component<BearerFormProps> = (props) => {
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

// Basic Auth Form
interface BasicFormProps {
  authStore: AuthStore;
}

const BasicForm: Component<BasicFormProps> = (props) => {
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

// OAuth2 Form
interface OAuth2FormProps {
  authStore: AuthStore;
}

const OAuth2Form: Component<OAuth2FormProps> = (props) => {
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

/**
 * Decode a JWT ID token and extract the username from common claims
 */
function getUsernameFromIdToken(idToken: string | undefined): string | null {
  if (!idToken) return null;

  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Try common OIDC claims for username/display name
    return payload.name || payload.preferred_username || payload.email || payload.sub || null;
  } catch {
    return null;
  }
}

// OpenID Connect Form
interface OpenIdFormProps {
  authStore: AuthStore;
}

const OpenIdForm: Component<OpenIdFormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'openid');
  const [issuerUrl, setIssuerUrl] = createSignal('');
  const [clientId, setClientId] = createSignal('');
  const [clientSecret, setClientSecret] = createSignal('');
  const [scopes, setScopes] = createSignal('openid profile email');
  const [isLoggingIn, setIsLoggingIn] = createSignal(false);
  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const [loginError, setLoginError] = createSignal<string | null>(null);

  // Timer signal to force periodic re-render of expiration countdown
  const [now, setNow] = createSignal(Date.now());
  const timer = setInterval(() => setNow(Date.now()), 10_000); // Update every 10 seconds
  onCleanup(() => clearInterval(timer));

  // Auto-refresh tokens when they're about to expire (60 seconds buffer)
  createEffect(() => {
    const config = existingConfig();
    const currentTime = now();

    // Only auto-refresh if we have tokens, a refresh token, and an expiration time
    if (!config?.accessToken || !config?.refreshToken || !config?.expiresAt) return;

    // Check if token is expiring within 60 seconds or already expired
    const timeUntilExpiry = config.expiresAt - currentTime;
    if (timeUntilExpiry <= 60_000 && !isRefreshing()) {
      // Trigger auto-refresh
      setIsRefreshing(true);
      props.authStore.actions.refreshOpenIdAuth().then((success) => {
        if (!success) {
          setLoginError(t('auth.refreshFailed'));
        } else {
          setLoginError(null);
        }
        setIsRefreshing(false);
      });
    }
  });

  const hasTokens = () => {
    const config = existingConfig();
    return config?.accessToken || config?.idToken;
  };

  const getTokenExpirationStatus = () => {
    const config = existingConfig();
    if (!config?.expiresAt) return null;

    const currentTime = now(); // Use reactive signal instead of Date.now()
    const expiresAt = config.expiresAt;

    if (currentTime >= expiresAt) {
      return { status: 'expired', text: t('auth.tokenExpired') };
    }

    const remainingMs = expiresAt - currentTime;
    const remainingMinutes = Math.floor(remainingMs / 60000);

    if (remainingMinutes < 5) {
      return {
        status: 'expiring',
        text: t('auth.tokenExpiringSoon').replace('{minutes}', String(remainingMinutes)),
      };
    }

    if (remainingMinutes < 60) {
      return {
        status: 'valid',
        text: t('auth.tokenExpiresIn').replace('{minutes}', String(remainingMinutes)),
      };
    }

    const remainingHours = Math.floor(remainingMinutes / 60);
    return {
      status: 'valid',
      text: t('auth.tokenExpiresInHours').replace('{hours}', String(remainingHours)),
    };
  };

  const handleLogin = async () => {
    const issuer = issuerUrl() || existingConfig()?.issuerUrl;
    const client = clientId() || existingConfig()?.clientId;
    const secret = clientSecret() || existingConfig()?.clientSecret;
    const scopeList = scopes() || existingConfig()?.scopes?.join(' ') || 'openid profile email';

    if (!issuer || !client) {
      setLoginError(t('auth.missingConfig'));
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      await props.authStore.actions.startOpenIdLogin(issuer, client, {
        clientSecret: secret || undefined,
        scopes: scopeList.split(' ').filter(Boolean),
      });
      // Note: This will redirect, so we won't reach here
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
      setIsLoggingIn(false);
    }
  };

  const handleRefreshTokens = async () => {
    setIsRefreshing(true);
    try {
      const success = await props.authStore.actions.refreshOpenIdAuth();
      if (!success) {
        setLoginError(t('auth.refreshFailed'));
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Refresh failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    props.authStore.actions.clearOpenIdAuth();
    setIssuerUrl('');
    setClientId('');
    setClientSecret('');
    setScopes('openid profile email');
    setLoginError(null);
  };

  return (
    <div class="space-y-3">
      {/* Show config form when not logged in */}
      <Show when={!hasTokens()}>
        <div>
          <label
            for="auth-openid-issuer"
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
          >
            {t('auth.issuerUrl')}
          </label>
          <Input
            id="auth-openid-issuer"
            type="text"
            value={existingConfig()?.issuerUrl || issuerUrl()}
            onInput={setIssuerUrl}
            placeholder="https://accounts.example.com"
          />
        </div>

        <div>
          <label
            for="auth-openid-client-id"
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
          >
            {t('auth.clientId')}
          </label>
          <Input
            id="auth-openid-client-id"
            type="text"
            value={existingConfig()?.clientId || clientId()}
            onInput={setClientId}
            placeholder="your-client-id"
          />
        </div>

        <div>
          <label
            for="auth-openid-client-secret"
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
          >
            {t('auth.clientSecret')}
          </label>
          <Input
            id="auth-openid-client-secret"
            type="password"
            value={existingConfig()?.clientSecret || clientSecret()}
            onInput={setClientSecret}
            placeholder={t('auth.clientSecretPlaceholder')}
          />
        </div>

        <div>
          <label
            for="auth-openid-scopes"
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5"
          >
            {t('auth.scopes')}
          </label>
          <Input
            id="auth-openid-scopes"
            type="text"
            value={existingConfig()?.scopes?.join(' ') || scopes()}
            onInput={setScopes}
            placeholder="openid profile email"
          />
        </div>

        <Show when={loginError()}>
          <div class="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p class="text-xs text-red-600 dark:text-red-400">{loginError()}</p>
          </div>
        </Show>

        <Button onClick={handleLogin} class="w-full py-2 text-sm" disabled={isLoggingIn()}>
          {isLoggingIn() ? t('auth.loggingIn') : t('auth.loginWithOpenId')}
        </Button>
      </Show>

      {/* Show logged in state */}
      <Show when={hasTokens()}>
        <div class="p-3 glass-card rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500" />
            <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Show
                when={getUsernameFromIdToken(existingConfig()?.idToken)}
                fallback={t('auth.loggedIn')}
              >
                {(username) => t('auth.loggedInAs').replace('{username}', username())}
              </Show>
            </p>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-300 truncate">
            <span class="font-medium">{t('auth.issuerUrl')}:</span> {existingConfig()?.issuerUrl}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-300 truncate mt-1">
            <span class="font-medium">{t('auth.clientId')}:</span> {existingConfig()?.clientId}
          </p>
        </div>

        {/* Token expiration status */}
        <Show when={getTokenExpirationStatus()}>
          {(status) => (
            <div
              class={`p-2 rounded-lg ${
                status().status === 'expired'
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : status().status === 'expiring'
                    ? 'bg-amber-50 dark:bg-amber-900/20'
                    : 'bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <p
                class={`text-xs ${
                  status().status === 'expired'
                    ? 'text-red-600 dark:text-red-400'
                    : status().status === 'expiring'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {status().text}
              </p>
            </div>
          )}
        </Show>

        <Show when={loginError()}>
          <div class="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p class="text-xs text-red-600 dark:text-red-400">{loginError()}</p>
          </div>
        </Show>

        <div class="flex gap-2">
          {/* Refresh button - only if we have a refresh token */}
          <Show when={existingConfig()?.refreshToken}>
            <Button
              onClick={handleRefreshTokens}
              variant="secondary"
              class="flex-1 py-2 text-sm"
              disabled={isRefreshing()}
            >
              {isRefreshing() ? t('auth.refreshing') : t('auth.refreshNow')}
            </Button>
          </Show>
          <Button onClick={handleLogout} variant="secondary" class="flex-1 py-2 text-sm">
            {t('auth.logout')}
          </Button>
        </div>
      </Show>
    </div>
  );
};
