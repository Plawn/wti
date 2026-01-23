/**
 * GraphQL support module
 *
 * Provides GraphQL introspection, conversion to unified ApiSpec, and request execution
 */

export { introspectSchema, type IntrospectionOptions } from './introspection';
export { convertGraphqlToSpec, type ConvertOptions as GraphqlConvertOptions } from './converter';
export {
  executeGraphqlRequest,
  buildGraphqlQuery,
  type GraphqlRequestOptions,
} from './client';
export type * from './types';

import type { ApiSpec } from '../types';
import { convertGraphqlToSpec } from './converter';
import { introspectSchema } from './introspection';

export interface GraphqlSpecResult {
  spec: ApiSpec;
}

/**
 * Load a GraphQL API spec from a server using introspection
 */
export async function loadGraphqlSpec(
  endpoint: string,
  options?: {
    title?: string;
    version?: string;
    description?: string;
    headers?: Record<string, string>;
  },
): Promise<GraphqlSpecResult> {
  const introspection = await introspectSchema(endpoint, { headers: options?.headers });

  const spec = convertGraphqlToSpec(introspection, {
    endpoint,
    title: options?.title,
    version: options?.version,
    description: options?.description,
  });

  return { spec };
}
