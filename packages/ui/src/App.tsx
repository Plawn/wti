import type { Operation, RequestValues, SpecInput } from '@wti/core';
import { Show, createEffect, createSignal, onMount } from 'solid-js';
import './styles/global.css';
import { CommandPalette } from './components/CommandPalette';
import { HistoryDrawer } from './components/History';
import { Layout } from './components/Layout';
import { SpecLoader } from './components/SpecLoader';
import { ErrorScreen, ErrorToast, LoadingScreen } from './components/screens';
import { ThemeProvider, useTheme } from './context';
import type { Locale } from './i18n';
import { I18nProvider } from './i18n';
import { type HistoryEntry, createAuthStore, createHistoryStore, createSpecStore } from './stores';
import type { Theme } from './types';
import { getParamsFromUrl } from './utils/url';

export type { Theme };

export interface WTIProps {
  /** Optional - if not provided, shows the spec loader UI */
  spec?: SpecInput;
  theme?: Theme;
  locale?: Locale;
  className?: string;
}

export function WTI(props: WTIProps) {
  return (
    <ThemeProvider initialTheme={props.theme}>
      <I18nProvider locale={props.locale ?? 'en'}>
        <WTIContent className={props.className} spec={props.spec} />
      </I18nProvider>
    </ThemeProvider>
  );
}

function WTIContent(props: { className?: string; spec?: SpecInput }) {
  const { theme } = useTheme();
  const store = createSpecStore();
  const authStore = createAuthStore();
  const historyStore = createHistoryStore();
  const [historyOpen, setHistoryOpen] = createSignal(false);
  const [replayValues, setReplayValues] = createSignal<RequestValues | undefined>(undefined);

  const themeClass = () => (theme() === 'dark' ? 'dark' : '');

  // Initialize stores
  onMount(async () => {
    await Promise.all([authStore.actions.init(), historyStore.actions.init()]);
    if (authStore.actions.hasPendingOidcCallback()) {
      await authStore.actions.handleOpenIdCallback();
    }
  });

  // Load spec from props
  createEffect(() => {
    if (props.spec) {
      store.actions.loadSpec(props.spec);
    }
  });

  // Handle URL deep linking
  createEffect(() => {
    if (store.state.spec && !store.state.selectedOperation) {
      const { operationId, serverIndex } = getParamsFromUrl();
      if (operationId) {
        if (serverIndex !== undefined) {
          store.actions.selectServerByIndex(serverIndex);
        }
        store.actions.selectOperationById(operationId);
      }
    }
  });

  const handleReplay = (entry: HistoryEntry) => {
    const operation = store.state.spec?.operations.find(
      (op: Operation) => op.id === entry.operationId,
    );
    if (operation && entry.requestValues) {
      setReplayValues(entry.requestValues);
      store.actions.selectOperation(operation);
      setHistoryOpen(false);
    }
  };

  return (
    <div
      class={`${themeClass()} font-sans text-sm text-gray-800 dark:text-gray-100 min-h-screen w-full ${props.className ?? ''}`}
    >
      <div class="fixed inset-0 bg-mesh -z-10" />
      <div class="fixed inset-0 pattern-dots -z-10" />

      <ErrorToast message={authStore.error()} title="OpenID Login Failed" />

      <Show when={store.state.loading}>
        <LoadingScreen />
      </Show>

      <Show when={store.state.error}>
        <ErrorScreen error={store.state.error} onRetry={() => store.actions.clearError()} />
      </Show>

      <Show when={store.state.spec}>
        <Layout
          store={store}
          authStore={authStore}
          historyStore={historyStore}
          onOpenHistory={() => setHistoryOpen(true)}
          replayValues={replayValues()}
          onReplayValuesConsumed={() => setReplayValues(undefined)}
        />
      </Show>

      <HistoryDrawer
        store={historyStore}
        open={historyOpen()}
        onClose={() => setHistoryOpen(false)}
        onOpen={() => setHistoryOpen(true)}
        onReplay={handleReplay}
      />

      <CommandPalette
        operations={store.state.spec?.operations ?? []}
        onSelectOperation={(op) => store.actions.selectOperation(op)}
        searchFn={store.search.searchOperations}
      />

      <Show when={!store.state.spec && !store.state.loading && !store.state.error}>
        <SpecLoader store={store} />
      </Show>
    </div>
  );
}
