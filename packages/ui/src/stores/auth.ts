import type {
  ApiKeyAuth,
  AuthConfig,
  BasicAuth,
  BearerAuth,
  OAuth2Auth,
  OpenIdAuth,
} from '@wti/core';
import { createSignal } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import {
  type OidcPkceState,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  generateCodeChallenge,
  generateCodeVerifier,
  generateRandomString,
  getOidcDiscovery,
  refreshOpenIdTokens,
  retrievePkceState,
  storePkceState,
} from '../auth/oidc';
import { storage } from '../storage';

const STORAGE_STORE = 'auth';
const STORAGE_KEY = 'state';

// Refresh tokens 60 seconds before expiration
const TOKEN_REFRESH_BUFFER_MS = 60 * 1000;
// Cooldown after failed refresh (30 seconds)
const REFRESH_COOLDOWN_MS = 30 * 1000;

export interface AuthStoreState {
  /**
   * Map of auth scheme name to auth config (undefined when cleared)
   */
  configs: Record<string, AuthConfig | undefined>;
  /**
   * Currently active auth scheme name
   */
  activeScheme: string | null;
}

const initialState: AuthStoreState = {
  configs: {},
  activeScheme: null,
};

export function createAuthStore() {
  const [state, setState] = createStore<AuthStoreState>(initialState);
  const [loading, setLoading] = createSignal(false);
  const [initialized, setInitialized] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [lastFailedRefresh, setLastFailedRefresh] = createSignal<number | null>(null);

  /**
   * Save auth state to IndexedDB
   */
  const persist = async () => {
    // Use unwrap to get plain object from SolidJS store proxy (required for IndexedDB serialization)
    const rawState = unwrap(state);
    await storage.set(STORAGE_STORE, STORAGE_KEY, {
      configs: rawState.configs,
      activeScheme: rawState.activeScheme,
    });
  };

  const actions = {
    /**
     * Initialize store by loading from IndexedDB
     */
    async init() {
      if (initialized()) {
        return;
      }

      setLoading(true);
      try {
        const stored = await storage.get<AuthStoreState>(STORAGE_STORE, STORAGE_KEY);
        if (stored) {
          setState({
            configs: stored.configs || {},
            activeScheme: stored.activeScheme || null,
          });
        }
      } catch (error) {
        console.warn('Failed to load auth state from storage:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    },

    /**
     * Check if store is loading
     */
    isLoading() {
      return loading();
    },

    /**
     * Check if store is initialized
     */
    isInitialized() {
      return initialized();
    },

    /**
     * Get the current error
     */
    getError() {
      return error();
    },

    /**
     * Clear the current error
     */
    clearError() {
      setError(null);
    },

    /**
     * Check if refresh is in cooldown period after a failed attempt
     */
    isRefreshInCooldown(): boolean {
      const lastFailed = lastFailedRefresh();
      if (!lastFailed) {
        return false;
      }
      return Date.now() - lastFailed < REFRESH_COOLDOWN_MS;
    },

    /**
     * Set API Key authentication
     */
    async setApiKey(
      name: string,
      value: string,
      location: 'header' | 'query' | 'cookie' = 'header',
    ) {
      const config: ApiKeyAuth = {
        type: 'apiKey',
        name,
        in: location,
        value,
      };
      setState('configs', name, config);
      setState('activeScheme', name);
      await persist();
    },

    /**
     * Set Bearer token authentication
     */
    async setBearerToken(token: string, scheme = 'Bearer') {
      const config: BearerAuth = {
        type: 'bearer',
        token,
        scheme,
      };
      const name = 'bearer';
      setState('configs', name, config);
      setState('activeScheme', name);
      await persist();
    },

    /**
     * Set Basic authentication
     */
    async setBasicAuth(username: string, password: string) {
      const config: BasicAuth = {
        type: 'basic',
        username,
        password,
      };
      const name = 'basic';
      setState('configs', name, config);
      setState('activeScheme', name);
      await persist();
    },

    /**
     * Set OAuth2 token authentication
     */
    async setOAuth2Token(
      accessToken: string,
      options?: {
        refreshToken?: string;
        expiresAt?: number;
        tokenType?: string;
        scopes?: string[];
      },
    ) {
      const config: OAuth2Auth = {
        type: 'oauth2',
        accessToken,
        refreshToken: options?.refreshToken,
        expiresAt: options?.expiresAt,
        tokenType: options?.tokenType || 'Bearer',
        scopes: options?.scopes,
      };
      const name = 'oauth2';
      setState('configs', name, config);
      setState('activeScheme', name);
      await persist();
    },

    /**
     * Set OpenID Connect authentication
     */
    async setOpenIdAuth(
      issuerUrl: string,
      clientId: string,
      options?: {
        clientSecret?: string;
        scopes?: string[];
        accessToken?: string;
        refreshToken?: string;
        idToken?: string;
        expiresAt?: number;
        tokenType?: string;
      },
    ) {
      const config: OpenIdAuth = {
        type: 'openid',
        issuerUrl,
        clientId,
        clientSecret: options?.clientSecret,
        scopes: options?.scopes,
        accessToken: options?.accessToken,
        refreshToken: options?.refreshToken,
        idToken: options?.idToken,
        expiresAt: options?.expiresAt,
        tokenType: options?.tokenType || 'Bearer',
      };
      const name = 'openid';
      setState('configs', name, config);
      setState('activeScheme', name);
      await persist();
    },

    /**
     * Clear OpenID Connect authentication
     */
    async clearOpenIdAuth() {
      setState('configs', 'openid', undefined);
      if (state.activeScheme === 'openid') {
        setState('activeScheme', null);
      }
      await persist();
    },

    /**
     * Clear authentication for a specific scheme
     */
    async clearAuth(schemeName?: string) {
      if (schemeName) {
        setState('configs', schemeName, undefined);
        if (state.activeScheme === schemeName) {
          setState('activeScheme', null);
        }
      } else {
        // Clear all auth
        setState({
          configs: {},
          activeScheme: null,
        });
      }
      await persist();
    },

    /**
     * Set the active auth scheme
     */
    async setActiveScheme(schemeName: string | null) {
      setState('activeScheme', schemeName);
      await persist();
    },

    /**
     * Get the currently active auth config
     */
    getActiveAuth(): AuthConfig | undefined {
      if (!state.activeScheme) {
        return undefined;
      }
      return state.configs[state.activeScheme];
    },

    /**
     * Check if a specific auth type is configured
     */
    isConfigured(authType: 'apiKey' | 'bearer' | 'basic' | 'oauth2' | 'openid'): boolean {
      return Object.values(state.configs).some((config) => config?.type === authType);
    },

    /**
     * Get auth config by type
     */
    getAuthByType(
      authType: 'apiKey' | 'bearer' | 'basic' | 'oauth2' | 'openid',
    ): AuthConfig | undefined {
      return Object.values(state.configs).find((config) => config?.type === authType);
    },

    /**
     * Check if OpenID token is expiring soon or already expired
     */
    isOpenIdTokenExpiringSoon(): boolean {
      const config = state.configs.openid as OpenIdAuth | undefined;
      if (!config?.expiresAt) {
        return false;
      }
      return Date.now() >= config.expiresAt - TOKEN_REFRESH_BUFFER_MS;
    },

    /**
     * Refresh OpenID Connect tokens
     * @returns true if refresh was successful, false otherwise
     */
    async refreshOpenIdAuth(): Promise<boolean> {
      const config = state.configs.openid as OpenIdAuth | undefined;
      if (!config || config.type !== 'openid' || !config.refreshToken) {
        return false;
      }

      try {
        const newTokens = await refreshOpenIdTokens(config);

        // Update the store with new tokens
        setState('configs', 'openid', {
          ...config,
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          expiresAt: newTokens.expiresAt,
          idToken: newTokens.idToken || config.idToken,
        });
        await persist();
        // Reset cooldown on success
        setLastFailedRefresh(null);
        return true;
      } catch (err) {
        console.error('Failed to refresh OpenID tokens:', err);
        // Set cooldown to prevent rapid retries
        setLastFailedRefresh(Date.now());
        return false;
      }
    },

    /**
     * Get active auth config, automatically refreshing OpenID tokens if needed
     * Use this before making API requests to ensure valid tokens
     * @returns AuthConfig if valid, undefined if no auth or token is expired and refresh failed
     */
    async getActiveAuthWithAutoRefresh(): Promise<AuthConfig | undefined> {
      if (!state.activeScheme) {
        return undefined;
      }

      const config = state.configs[state.activeScheme];
      if (!config) {
        return undefined;
      }

      // Auto-refresh OpenID tokens if expiring soon
      if (config.type === 'openid' && config.refreshToken && config.expiresAt) {
        const now = Date.now();
        const isExpiringSoon = now >= config.expiresAt - TOKEN_REFRESH_BUFFER_MS;
        const isFullyExpired = now >= config.expiresAt;

        if (isExpiringSoon && !this.isRefreshInCooldown()) {
          const refreshed = await this.refreshOpenIdAuth();
          if (refreshed) {
            // Return the updated config
            return state.configs[state.activeScheme];
          }

          // Refresh failed - check if token is fully expired
          if (isFullyExpired) {
            console.warn('OpenID token expired and refresh failed. Authentication invalid.');
            return undefined;
          }

          // Token hasn't fully expired yet, return it with a warning
          console.warn(
            'OpenID token refresh failed but token not yet expired. Using existing token.',
          );
        } else if (isFullyExpired) {
          // Token is expired and we're in cooldown - auth is invalid
          return undefined;
        }
      }

      return config;
    },

    /**
     * Start OpenID Connect authorization flow with PKCE
     * Redirects the user to the OIDC provider's login page
     */
    async startOpenIdLogin(
      issuerUrl: string,
      clientId: string,
      options?: {
        clientSecret?: string;
        scopes?: string[];
        redirectUri?: string;
      },
    ): Promise<void> {
      // Fetch OIDC discovery document
      const discovery = await getOidcDiscovery(issuerUrl);

      // Generate PKCE code verifier and challenge
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Generate state parameter for CSRF protection
      const stateParam = generateRandomString(32);

      // Use current URL as redirect URI if not specified
      const redirectUri = options?.redirectUri || window.location.origin + window.location.pathname;

      // Store PKCE state for the callback
      const pkceState: OidcPkceState = {
        issuerUrl,
        clientId,
        clientSecret: options?.clientSecret,
        scopes: options?.scopes || ['openid', 'profile', 'email'],
        codeVerifier,
        redirectUri,
        state: stateParam,
      };
      storePkceState(pkceState);

      // Build and redirect to authorization URL
      const authUrl = buildAuthorizationUrl({
        authorizationEndpoint: discovery.authorizationEndpoint,
        clientId,
        redirectUri,
        scopes: pkceState.scopes,
        state: stateParam,
        codeChallenge,
      });

      window.location.href = authUrl;
    },

    /**
     * Handle OpenID Connect callback after authorization
     * Call this when the page loads with authorization code in URL
     * Sets error state internally and auto-clears after 5 seconds
     * @returns true if callback was handled successfully
     */
    async handleOpenIdCallback(): Promise<boolean> {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const stateParam = url.searchParams.get('state');
      const urlError = url.searchParams.get('error');
      const errorDescription = url.searchParams.get('error_description');

      let errorClearTimer: ReturnType<typeof setTimeout> | undefined;
      const setErrorWithAutoClear = (message: string) => {
        if (errorClearTimer) {
          clearTimeout(errorClearTimer);
        }
        setError(message);
        errorClearTimer = setTimeout(() => setError(null), 5000);
      };

      // Check if this is an OIDC callback
      if (!code && !urlError) {
        return false;
      }

      // Handle error from provider
      if (urlError) {
        setErrorWithAutoClear(errorDescription || urlError);
        return false;
      }

      // Retrieve PKCE state
      const pkceState = retrievePkceState();
      if (!pkceState) {
        setErrorWithAutoClear('Missing PKCE state - authorization flow may have expired');
        return false;
      }

      // Verify state parameter
      if (stateParam !== pkceState.state) {
        setErrorWithAutoClear('Invalid state parameter - possible CSRF attack');
        return false;
      }

      // Verify authorization code exists
      if (!code) {
        setErrorWithAutoClear('Missing authorization code');
        return false;
      }

      try {
        // Exchange authorization code for tokens
        const tokens = await exchangeCodeForTokens({
          issuerUrl: pkceState.issuerUrl,
          clientId: pkceState.clientId,
          clientSecret: pkceState.clientSecret,
          code,
          redirectUri: pkceState.redirectUri,
          codeVerifier: pkceState.codeVerifier,
        });

        // Store the tokens
        await this.setOpenIdAuth(pkceState.issuerUrl, pkceState.clientId, {
          clientSecret: pkceState.clientSecret,
          scopes: pkceState.scopes,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          idToken: tokens.idToken,
          expiresAt: tokens.expiresAt,
          tokenType: tokens.tokenType,
        });

        // Clean up URL (remove code and state params)
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        window.history.replaceState({}, '', url.toString());

        return true;
      } catch (err) {
        setErrorWithAutoClear(err instanceof Error ? err.message : 'Token exchange failed');
        return false;
      }
    },

    /**
     * Check if there's a pending OIDC callback to handle
     */
    hasPendingOidcCallback(): boolean {
      const url = new URL(window.location.href);
      return url.searchParams.has('code') || url.searchParams.has('error');
    },
  };

  return { state, actions, loading, initialized, error };
}

export type AuthStore = ReturnType<typeof createAuthStore>;
