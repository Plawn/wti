import { type Accessor, type JSX, createContext, createSignal, useContext } from 'solid-js';
import { getLocalStorageItem, setLocalStorageItem } from '../storage';
import { en } from './en';
import { fr } from './fr';
import type { Locale, TranslationKey, Translations } from './types';

const LOCALE_STORAGE_KEY = 'wti:locale';
const translations: Record<Locale, Translations> = { en, fr };
const supportedLocales: Locale[] = ['en', 'fr'];

/** Detect browser locale, falling back to 'en' */
function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'en';
  }
  const browserLang = navigator.language.split('-')[0];
  return supportedLocales.includes(browserLang as Locale) ? (browserLang as Locale) : 'en';
}

/** Get initial locale from storage or browser */
function getInitialLocale(propLocale?: Locale): Locale {
  if (propLocale) {
    return propLocale;
  }
  const stored = getLocalStorageItem<Locale | null>(LOCALE_STORAGE_KEY, null);
  if (stored && supportedLocales.includes(stored)) {
    return stored;
  }
  return detectBrowserLocale();
}

/** Get nested value from object by dot-separated path */
function get(obj: unknown, path: string): string {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return path;
  }, obj) as string;
}

/** Interpolate variables in translation string: "{name}" -> value */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return key in vars ? String(vars[key]) : `{${key}}`;
  });
}

export interface I18nContextValue {
  /** Translate a key with optional interpolation variables */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Current locale accessor */
  locale: Accessor<Locale>;
  /** Change the current locale (persisted to localStorage) */
  setLocale: (locale: Locale) => void;
  /** List of supported locales */
  supportedLocales: readonly Locale[];
}

const I18nContext = createContext<I18nContextValue>();

export interface I18nProviderProps {
  /** Initial locale (optional - defaults to stored/browser locale) */
  locale?: Locale;
  children: JSX.Element;
}

export function I18nProvider(props: I18nProviderProps) {
  const [locale, setLocaleSignal] = createSignal<Locale>(getInitialLocale(props.locale));

  const setLocale = (newLocale: Locale) => {
    if (supportedLocales.includes(newLocale)) {
      setLocaleSignal(newLocale);
      setLocalStorageItem(LOCALE_STORAGE_KEY, newLocale);
    }
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    const currentTranslations = translations[locale()] || translations.en;
    const template = get(currentTranslations, key);
    return interpolate(template, vars);
  };

  const value: I18nContextValue = {
    t,
    locale,
    setLocale,
    supportedLocales,
  };

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
