import type { SecurityRequirement } from '@wti/core';
import {
  type Component,
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { type OidcDiscovery, getOidcDiscovery } from '../../../auth/oidc';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { Button, Input } from '../../shared';

interface OpenIdFormProps {
  authStore: AuthStore;
  securitySchemes?: Record<string, SecurityRequirement>;
}

/**
 * Decode a JWT ID token and extract the username from common claims
 */
function getUsernameFromIdToken(idToken: string | undefined): string | null {
  if (!idToken) {
    return null;
  }

  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Try common OIDC claims for username/display name
    return payload.name || payload.preferred_username || payload.email || payload.sub || null;
  } catch {
    return null;
  }
}

/**
 * Extract the OpenID Connect URL from security schemes
 */
function getOpenIdConnectUrl(schemes?: Record<string, SecurityRequirement>): string | undefined {
  if (!schemes) {
    return undefined;
  }
  for (const scheme of Object.values(schemes)) {
    if (scheme.type === 'openIdConnect' && scheme.openIdConnectUrl) {
      return scheme.openIdConnectUrl;
    }
  }
  return undefined;
}

/**
 * Extract issuer URL from openIdConnectUrl (remove .well-known suffix if present)
 */
function extractIssuerFromUrl(url: string): string {
  return url.replace(/\/?\.well-known\/openid-configuration\/?$/, '').replace(/\/$/, '');
}

export const OpenIdForm: Component<OpenIdFormProps> = (props) => {
  const { t } = useI18n();
  const existingConfig = useAuthConfig(props.authStore, 'openid');
  const [issuerUrl, setIssuerUrl] = createSignal('');
  const [clientId, setClientId] = createSignal('');
  const [clientSecret, setClientSecret] = createSignal('');
  const [scopes, setScopes] = createSignal('openid profile email');
  const [isLoggingIn, setIsLoggingIn] = createSignal(false);
  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const [loginError, setLoginError] = createSignal<string | null>(null);

  // Discovery document from swagger's openIdConnectUrl
  const [discovery, setDiscovery] = createSignal<OidcDiscovery | null>(null);
  const [isLoadingDiscovery, setIsLoadingDiscovery] = createSignal(false);

  // Extract openIdConnectUrl from swagger security schemes
  const openIdConnectUrl = () => getOpenIdConnectUrl(props.securitySchemes);

  // Initialize form from existing config or swagger on mount
  onMount(async () => {
    const config = existingConfig();

    // Priority 1: Use existing persisted config
    if (config?.issuerUrl) {
      setIssuerUrl(config.issuerUrl);
      if (config.clientId) {
        setClientId(config.clientId);
      }
      if (config.clientSecret) {
        setClientSecret(config.clientSecret);
      }
      if (config.scopes?.length) {
        setScopes(config.scopes.join(' '));
      }
      // Also fetch discovery for scope suggestions
      setIsLoadingDiscovery(true);
      try {
        const disc = await getOidcDiscovery(config.issuerUrl);
        setDiscovery(disc);
      } catch {
        // Silently ignore
      } finally {
        setIsLoadingDiscovery(false);
      }
      return;
    }

    // Priority 2: Use swagger's openIdConnectUrl
    const url = openIdConnectUrl();
    if (url) {
      const issuer = extractIssuerFromUrl(url);
      setIssuerUrl(issuer);
      setIsLoadingDiscovery(true);
      try {
        const disc = await getOidcDiscovery(issuer);
        setDiscovery(disc);
        // Pre-fill scopes with common ones from discovery
        if (disc.scopesSupported) {
          const defaultScopes = ['openid', 'profile', 'email'].filter((s) =>
            disc.scopesSupported?.includes(s),
          );
          if (defaultScopes.length > 0) {
            setScopes(defaultScopes.join(' '));
          }
        }
      } catch {
        // Silently ignore discovery errors - user can still manually enter
      } finally {
        setIsLoadingDiscovery(false);
      }
    }
  });

  // Timer signal to force periodic re-render of expiration countdown
  const [now, setNow] = createSignal(Date.now());
  const timer = setInterval(() => setNow(Date.now()), 10_000); // Update every 10 seconds
  onCleanup(() => clearInterval(timer));

  // Auto-refresh tokens when they're about to expire (60 seconds buffer)
  createEffect(() => {
    const config = existingConfig();
    const currentTime = now();

    // Only auto-refresh if we have tokens, a refresh token, and an expiration time
    if (!config?.accessToken || !config?.refreshToken || !config?.expiresAt) {
      return;
    }

    // Check if token is expiring within 60 seconds or already expired
    const timeUntilExpiry = config.expiresAt - currentTime;
    const shouldRefresh =
      timeUntilExpiry <= 60_000 &&
      !isRefreshing() &&
      !props.authStore.actions.isRefreshInCooldown();

    if (shouldRefresh) {
      // Trigger auto-refresh
      setIsRefreshing(true);
      props.authStore.actions
        .refreshOpenIdAuth()
        .then((success) => {
          if (!success) {
            setLoginError(t('auth.refreshFailed'));
          } else {
            setLoginError(null);
          }
        })
        .catch(() => {
          setLoginError(t('auth.refreshFailed'));
        })
        .finally(() => {
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
    if (!config?.expiresAt) {
      return null;
    }

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
        text: t('auth.tokenExpiringSoon', { minutes: remainingMinutes }),
      };
    }

    if (remainingMinutes < 60) {
      return {
        status: 'valid',
        text: t('auth.tokenExpiresIn', { minutes: remainingMinutes }),
      };
    }

    const remainingHours = Math.floor(remainingMinutes / 60);
    return {
      status: 'valid',
      text: t('auth.tokenExpiresInHours', { hours: remainingHours }),
    };
  };

  const handleLogin = async () => {
    const issuer = issuerUrl();
    const client = clientId();
    const secret = clientSecret();
    const scopeList = scopes() || 'openid profile email';

    if (!issuer || !client) {
      setLoginError(t('auth.missingConfig'));
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      // Save client config before redirecting so it persists across sessions
      await props.authStore.actions.saveOpenIdClientConfig(issuer, client, {
        clientSecret: secret || undefined,
        scopes: scopeList.split(' ').filter(Boolean),
      });

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
    // Keep client config in local state - clearOpenIdAuth preserves it in storage
    setLoginError(null);
  };

  return (
    <div class="space-y-3">
      {/* Show config form when not logged in */}
      <Show when={!hasTokens()}>
        <div>
          <label
            for="auth-openid-issuer"
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
          >
            {t('auth.issuerUrl')}
          </label>
          <Input
            id="auth-openid-issuer"
            type="text"
            value={issuerUrl()}
            onInput={setIssuerUrl}
            placeholder="https://accounts.example.com"
          />
        </div>

        <div>
          <label
            for="auth-openid-client-id"
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
          >
            {t('auth.clientId')}
          </label>
          <Input
            id="auth-openid-client-id"
            type="text"
            value={clientId()}
            onInput={setClientId}
            placeholder="your-client-id"
          />
        </div>

        <div>
          <label
            for="auth-openid-client-secret"
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
          >
            {t('auth.clientSecret')}
          </label>
          <Input
            id="auth-openid-client-secret"
            type="password"
            value={clientSecret()}
            onInput={setClientSecret}
            placeholder={t('auth.clientSecretPlaceholder')}
          />
        </div>

        <div>
          <label
            for="auth-openid-scopes"
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
          >
            {t('auth.scopes')}
          </label>
          <Input
            id="auth-openid-scopes"
            type="text"
            value={scopes()}
            onInput={setScopes}
            placeholder="openid profile email"
          />
          {/* Available scopes from discovery */}
          <Show when={discovery()?.scopesSupported?.length}>
            <div class="mt-2">
              <p class="text-xs text-surface-500 dark:text-surface-400 mb-1.5">
                {t('auth.availableScopes')}
              </p>
              <div class="flex flex-wrap gap-1">
                <For each={discovery()?.scopesSupported}>
                  {(scope) => {
                    const isSelected = () => scopes().split(' ').includes(scope);
                    const toggleScope = () => {
                      const current = scopes().split(' ').filter(Boolean);
                      if (isSelected()) {
                        setScopes(current.filter((s) => s !== scope).join(' '));
                      } else {
                        setScopes([...current, scope].join(' '));
                      }
                    };
                    return (
                      <button
                        type="button"
                        onClick={toggleScope}
                        class={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                          isSelected()
                            ? 'bg-accent-500/20 text-accent-700 dark:text-accent-300 ring-1 ring-accent-500/30'
                            : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                      >
                        {scope}
                      </button>
                    );
                  }}
                </For>
              </div>
            </div>
          </Show>
          <Show when={isLoadingDiscovery()}>
            <p class="text-xs text-surface-500 dark:text-surface-400 mt-1.5">
              {t('auth.loadingDiscovery')}
            </p>
          </Show>
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
                {(username) => t('auth.loggedInAs', { username: username() })}
              </Show>
            </p>
          </div>
          <p class="text-xs text-surface-600 dark:text-surface-300 truncate">
            <span class="font-medium">{t('auth.issuerUrl')}:</span> {existingConfig()?.issuerUrl}
          </p>
          <p class="text-xs text-surface-600 dark:text-surface-300 truncate mt-1">
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
                    : 'bg-surface-50 dark:bg-surface-800/50'
              }`}
            >
              <p
                class={`text-xs ${
                  status().status === 'expired'
                    ? 'text-red-600 dark:text-red-400'
                    : status().status === 'expiring'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-surface-600 dark:text-surface-400'
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
