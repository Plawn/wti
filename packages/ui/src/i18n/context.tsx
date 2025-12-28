import { createContext, useContext, createMemo, type JSX } from 'solid-js';
import type { Translations, Locale } from './types';
import { en } from './en';
import { fr } from './fr';

const translations: Record<Locale, Translations> = { en, fr };

function get(obj: unknown, path: string): string {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return path;
  }, obj) as string;
}

interface I18nContextValue {
  t: (key: string) => string;
  locale: () => Locale;
}

const I18nContext = createContext<I18nContextValue>();

interface I18nProviderProps {
  locale: Locale;
  children: JSX.Element;
}

export function I18nProvider(props: I18nProviderProps) {
  const currentTranslations = createMemo(() => translations[props.locale] || translations.en);

  const t = (key: string): string => {
    return get(currentTranslations(), key);
  };

  const locale = () => props.locale;

  return <I18nContext.Provider value={{ t, locale }}>{props.children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
