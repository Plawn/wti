// Main component
export { WTI, type WTIProps, type Theme } from './App';

// i18n
export { I18nProvider, useI18n, type Locale, type Translations } from './i18n';

// Stores
export { createSpecStore, type SpecStore, type SpecState } from './stores';

// Re-export core types
export type {
  ApiSpec,
  Operation,
  Parameter,
  Schema,
  SpecInput,
  OpenApiInput,
  GrpcInput,
} from '@wti/core';
