import { createEffect, Show } from 'solid-js';
import type { SpecInput } from '@wti/core';
import type { Locale } from './i18n';
import { I18nProvider } from './i18n';
import { lightTheme, darkTheme } from './themes';
import { createSpecStore, type SpecStore } from './stores';
import * as styles from './App.css';

export type Theme = 'light' | 'dark';

export interface WTIProps {
  spec: SpecInput;
  theme?: Theme;
  locale?: Locale;
  className?: string;
}

export function WTI(props: WTIProps) {
  const store = createSpecStore();

  const themeClass = () => (props.theme === 'dark' ? darkTheme : lightTheme);
  const locale = () => props.locale ?? 'en';

  createEffect(() => {
    store.actions.loadSpec(props.spec);
  });

  return (
    <I18nProvider locale={locale()}>
      <div class={`${styles.root} ${themeClass()} ${props.className ?? ''}`}>
        <Show when={store.state.loading}>
          <div class={styles.loading}>Loading...</div>
        </Show>

        <Show when={store.state.error}>
          <div class={styles.error}>{store.state.error}</div>
        </Show>

        <Show when={store.state.spec}>
          <Layout store={store} />
        </Show>
      </div>
    </I18nProvider>
  );
}

interface LayoutProps {
  store: SpecStore;
}

function Layout(props: LayoutProps) {
  return (
    <div class={styles.layout}>
      <aside class={styles.sidebar}>
        <header class={styles.sidebarHeader}>
          <h1 class={styles.title}>{props.store.state.spec?.info.title}</h1>
          <span class={styles.version}>v{props.store.state.spec?.info.version}</span>
        </header>
        {/* TODO: Sidebar content */}
      </aside>

      <main class={styles.main}>
        <Show when={props.store.state.selectedOperation} fallback={<WelcomeScreen />}>
          {/* TODO: Operation detail */}
          <div>Operation: {props.store.state.selectedOperation?.id}</div>
        </Show>
      </main>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div class={styles.welcome}>
      <h2>WTI - What The Interface</h2>
      <p>Select an operation from the sidebar to get started.</p>
    </div>
  );
}
