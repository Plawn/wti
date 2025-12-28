export interface Translations {
  common: {
    send: string;
    cancel: string;
    copy: string;
    copied: string;
    close: string;
    search: string;
    loading: string;
    error: string;
    noResults: string;
    required: string;
    optional: string;
    deprecated: string;
    tryIt: string;
    clear: string;
  };
  operations: {
    parameters: string;
    requestBody: string;
    responses: string;
    headers: string;
    query: string;
    path: string;
    cookie: string;
    noParameters: string;
    noRequestBody: string;
  };
  response: {
    status: string;
    time: string;
    size: string;
    body: string;
    headers: string;
    noResponse: string;
  };
  auth: {
    title: string;
    apiKey: string;
    bearer: string;
    basic: string;
    oauth2: string;
    username: string;
    password: string;
    token: string;
    authorize: string;
    logout: string;
    configured: string;
    notConfigured: string;
  };
  codegen: {
    title: string;
    curl: string;
    javascript: string;
    python: string;
    go: string;
  };
  history: {
    title: string;
    empty: string;
    clearAll: string;
  };
  sidebar: {
    allOperations: string;
    servers: string;
  };
}

export type Locale = 'en' | 'fr';

export type TranslationKey = FlattenKeys<Translations>;

type FlattenKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? FlattenKeys<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;
