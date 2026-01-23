/**
 * GraphQL introspection client
 */

import type { GraphqlSchema, GraphqlType, IntrospectionResult } from './types';

// Standard introspection query
const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args { ...InputValue }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args { ...InputValue }
      type { ...TypeRef }
      isDeprecated
      deprecationReason
    }
    inputFields { ...InputValue }
    interfaces { ...TypeRef }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes { ...TypeRef }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
`;

export interface IntrospectionOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export async function introspectSchema(
  endpoint: string,
  options?: IntrospectionOptions,
): Promise<IntrospectionResult> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify({ query: INTROSPECTION_QUERY }),
    signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Introspection failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(`GraphQL error: ${result.errors[0].message}`);
  }

  const schema: GraphqlSchema = result.data.__schema;

  // Build types map for quick lookup
  const types = new Map<string, GraphqlType>();
  for (const type of schema.types) {
    if (type.name) {
      types.set(type.name, type);
    }
  }

  return { schema, types };
}
