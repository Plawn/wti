/**
 * Authentication configuration types
 */

export interface ApiKeyAuth {
  type: 'apiKey';
  name: string;
  in: 'header' | 'query' | 'cookie';
  value: string;
}

export interface BearerAuth {
  type: 'bearer';
  token: string;
  scheme?: string;
}

export interface BasicAuth {
  type: 'basic';
  username: string;
  password: string;
}

export interface OAuth2Auth {
  type: 'oauth2';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scopes?: string[];
}

export type AuthConfig = ApiKeyAuth | BearerAuth | BasicAuth | OAuth2Auth;

export interface AuthState {
  configs: Record<string, AuthConfig>;
  activeScheme?: string;
}
