import type { OpenIdAuth } from '@wti/core';

// Cache for OIDC discovery documents
export interface OidcDiscovery {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  fetchedAt: number;
}

const discoveryCache = new Map<string, OidcDiscovery>();
const DISCOVERY_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// PKCE state stored during authorization flow
export interface OidcPkceState {
  issuerUrl: string;
  clientId: string;
  clientSecret?: string;
  scopes: string[];
  codeVerifier: string;
  redirectUri: string;
  state: string;
}

const OIDC_STATE_KEY = 'wti-oidc-state';

/**
 * Generate a cryptographically random string for PKCE
 */
export function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((v) => charset[v % charset.length])
    .join('');
}

/**
 * Generate PKCE code verifier (43-128 characters)
 */
export function generateCodeVerifier(): string {
  return generateRandomString(64);
}

/**
 * Generate PKCE code challenge from verifier using SHA-256
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  // Base64url encode the hash
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Fetch OIDC discovery document
 */
export async function getOidcDiscovery(issuerUrl: string): Promise<OidcDiscovery> {
  const cached = discoveryCache.get(issuerUrl);
  if (cached && Date.now() - cached.fetchedAt < DISCOVERY_CACHE_TTL_MS) {
    return cached;
  }

  const discoveryUrl = `${issuerUrl.replace(/\/$/, '')}/.well-known/openid-configuration`;
  const response = await fetch(discoveryUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch OIDC discovery document: ${response.status}`);
  }

  const doc = await response.json();
  if (!doc.authorization_endpoint || !doc.token_endpoint) {
    throw new Error('OIDC discovery document missing required endpoints');
  }

  const discovery: OidcDiscovery = {
    authorizationEndpoint: doc.authorization_endpoint,
    tokenEndpoint: doc.token_endpoint,
    fetchedAt: Date.now(),
  };

  discoveryCache.set(issuerUrl, discovery);
  return discovery;
}

/**
 * Get token endpoint from discovery (for refresh)
 */
export async function getTokenEndpoint(issuerUrl: string): Promise<string> {
  const discovery = await getOidcDiscovery(issuerUrl);
  return discovery.tokenEndpoint;
}

/**
 * Store PKCE state for the callback (uses sessionStorage - session-scoped)
 */
export function storePkceState(pkceState: OidcPkceState): void {
  sessionStorage.setItem(OIDC_STATE_KEY, JSON.stringify(pkceState));
}

/**
 * Retrieve and clear PKCE state
 */
export function retrievePkceState(): OidcPkceState | null {
  const stored = sessionStorage.getItem(OIDC_STATE_KEY);
  if (!stored) {
    return null;
  }
  sessionStorage.removeItem(OIDC_STATE_KEY);
  try {
    return JSON.parse(stored) as OidcPkceState;
  } catch {
    return null;
  }
}

export interface TokenRefreshResult {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  idToken?: string;
}

/**
 * Validate token response structure from OIDC provider
 */
function validateTokenResponse(
  tokens: unknown,
  context: string,
): asserts tokens is {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
} {
  if (!tokens || typeof tokens !== 'object') {
    throw new Error(`${context}: Invalid response - expected object`);
  }

  const tokenObj = tokens as Record<string, unknown>;

  if (typeof tokenObj.access_token !== 'string' || !tokenObj.access_token) {
    throw new Error(`${context}: Missing or invalid access_token in response`);
  }

  if (tokenObj.refresh_token !== undefined && typeof tokenObj.refresh_token !== 'string') {
    throw new Error(`${context}: Invalid refresh_token type in response`);
  }

  if (tokenObj.id_token !== undefined && typeof tokenObj.id_token !== 'string') {
    throw new Error(`${context}: Invalid id_token type in response`);
  }

  if (tokenObj.expires_in !== undefined && typeof tokenObj.expires_in !== 'number') {
    throw new Error(`${context}: Invalid expires_in type in response`);
  }
}

/**
 * Refresh OpenID Connect tokens using refresh token
 */
export async function refreshOpenIdTokens(config: OpenIdAuth): Promise<TokenRefreshResult> {
  if (!config.refreshToken) {
    throw new Error('No refresh token available');
  }

  const tokenEndpoint = await getTokenEndpoint(config.issuerUrl);

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken,
    client_id: config.clientId,
  });

  if (config.clientSecret) {
    body.set('client_secret', config.clientSecret);
  }

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
  }

  const tokens = await response.json();
  validateTokenResponse(tokens, 'Token refresh');

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || config.refreshToken, // Keep old refresh token if not rotated
    expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
    idToken: tokens.id_token,
  };
}

export interface TokenExchangeParams {
  issuerUrl: string;
  clientId: string;
  clientSecret?: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}

export interface TokenExchangeResult {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
  tokenType: string;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  params: TokenExchangeParams,
): Promise<TokenExchangeResult> {
  const tokenEndpoint = await getTokenEndpoint(params.issuerUrl);

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: params.code,
    redirect_uri: params.redirectUri,
    client_id: params.clientId,
    code_verifier: params.codeVerifier,
  });

  if (params.clientSecret) {
    body.set('client_secret', params.clientSecret);
  }

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${errorText}`);
  }

  const tokens = await response.json();
  validateTokenResponse(tokens, 'Token exchange');

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    idToken: tokens.id_token,
    expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
    tokenType: tokens.token_type || 'Bearer',
  };
}

export interface AuthorizationUrlParams {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state: string;
  codeChallenge: string;
}

/**
 * Build the authorization URL for OIDC login
 */
export function buildAuthorizationUrl(params: AuthorizationUrlParams): string {
  const authUrl = new URL(params.authorizationEndpoint);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', params.clientId);
  authUrl.searchParams.set('redirect_uri', params.redirectUri);
  authUrl.searchParams.set('scope', params.scopes.join(' '));
  authUrl.searchParams.set('state', params.state);
  authUrl.searchParams.set('code_challenge', params.codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  return authUrl.toString();
}
