import type { ApiKeyAuth, BasicAuth, BearerAuth, OAuth2Auth, OpenIdAuth } from '@wti/core';
import type { AuthStore } from '../stores';

type AuthType = 'apiKey' | 'bearer' | 'basic' | 'oauth2' | 'openid';

type AuthConfigMap = {
  apiKey: ApiKeyAuth;
  bearer: BearerAuth;
  basic: BasicAuth;
  oauth2: OAuth2Auth;
  openid: OpenIdAuth;
};

/**
 * Get the existing auth config for a specific type with proper type narrowing.
 * Returns a reactive getter function.
 */
export function useAuthConfig<T extends AuthType>(
  authStore: AuthStore,
  authType: T,
): () => AuthConfigMap[T] | undefined {
  return () => {
    const config = authStore.actions.getAuthByType(authType);
    return config?.type === authType ? (config as AuthConfigMap[T]) : undefined;
  };
}
