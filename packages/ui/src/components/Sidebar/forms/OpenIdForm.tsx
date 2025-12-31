import { type Component, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { useAuthConfig } from '../../../hooks';
import { useI18n } from '../../../i18n';
import type { AuthStore } from '../../../stores';
import { Button, Input } from '../../shared';

interface OpenIdFormProps {
  authStore: AuthStore;
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
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
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
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
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
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
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
            class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5"
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
