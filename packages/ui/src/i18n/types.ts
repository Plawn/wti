export interface Translations {
  common: {
    send: string;
    cancel: string;
    copy: string;
    copied: string;
    copyLink: string;
    linkCopied: string;
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
    jsonMode: string;
    formMode: string;
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
    openid: string;
    username: string;
    password: string;
    token: string;
    authorize: string;
    logout: string;
    configured: string;
    notConfigured: string;
    issuerUrl: string;
    clientId: string;
    clientSecret: string;
    clientSecretPlaceholder: string;
    scopes: string;
    accessToken: string;
    accessTokenPlaceholder: string;
    idToken: string;
    idTokenPlaceholder: string;
    configure: string;
    setTokens: string;
    editConfig: string;
    openidConfigured: string;
    openidTokenHint: string;
    tokensSet: string;
    refreshToken: string;
    refreshTokenPlaceholder: string;
    refreshTokenHint: string;
    expiresIn: string;
    expiresInHint: string;
    tokenExpired: string;
    tokenExpiringSoon: string;
    tokenExpiresIn: string;
    tokenExpiresInHours: string;
    refreshNow: string;
    refreshing: string;
    loginWithOpenId: string;
    loggingIn: string;
    loggedIn: string;
    loggedInAs: string;
    missingConfig: string;
    refreshFailed: string;
    availableScopes: string;
    loadingDiscovery: string;
  };
  codegen: {
    title: string;
    curl: string;
    curlPreview: string;
    javascript: string;
    python: string;
    go: string;
  };
  history: {
    title: string;
    empty: string;
    clearAll: string;
    confirmClear: string;
    replay: string;
    delete: string;
    success: string;
    failed: string;
    export: string;
    import: string;
    navigate: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
  sidebar: {
    allOperations: string;
    servers: string;
    serverVariables: string;
    toggleThemeLight: string;
    toggleThemeDark: string;
  };
  specLoader: {
    title: string;
    subtitle: string;
    uploadFile: string;
    loadFromUrl: string;
    load: string;
    loading: string;
    or: string;
    clickToUpload: string;
    orDragDrop: string;
    supportedFormats: string;
    urlRequired: string;
    loadFailed: string;
    invalidFileType: string;
    jsonOnly: string;
    tryExample: string;
  };
  commandPalette: {
    placeholder: string;
    noResults: string;
    navigate: string;
    select: string;
  };
  validation: {
    required: string;
    type: string;
    minLength: string;
    maxLength: string;
    minimum: string;
    maximum: string;
    exclusiveMinimum: string;
    exclusiveMaximum: string;
    multipleOf: string;
    pattern: string;
    enum: string;
    const: string;
    minItems: string;
    maxItems: string;
    uniqueItems: string;
    missingProperty: string;
    format: string;
    invalidNumber: string;
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
