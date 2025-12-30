import type { Operation, RequestValues, SpecInput } from '@wti/core';
import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import './styles/global.css';
import { CommandPalette } from './components/CommandPalette';
import { HistoryDrawer } from './components/History';
import { OperationPanel } from './components/Operation';
import { Sidebar } from './components/Sidebar';
import { SpecLoader } from './components/SpecLoader';
import { Drawer } from './components/shared';
import { ThemeProvider, useTheme } from './context';
import type { Locale } from './i18n';
import { I18nProvider } from './i18n';
import {
  type AuthStore,
  type HistoryStore,
  type SpecStore,
  createAuthStore,
  createHistoryStore,
  createSpecStore,
} from './stores';
import { getParamsFromUrl } from './utils/url';

export type Theme = 'light' | 'dark';

export interface WTIProps {
  /** Optional - if not provided, shows the spec loader UI */
  spec?: SpecInput;
  theme?: Theme;
  locale?: Locale;
  className?: string;
}

export function WTI(props: WTIProps) {
  const locale = () => props.locale ?? 'en';

  return (
    <ThemeProvider initialTheme={props.theme}>
      <I18nProvider locale={locale()}>
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
  const [oidcError, setOidcError] = createSignal<string | null>(null);
  const [historyOpen, setHistoryOpen] = createSignal(false);
  const [replayValues, setReplayValues] = createSignal<RequestValues | undefined>(undefined);
  const [commandPaletteOpen, setCommandPaletteOpen] = createSignal(false);

  const themeClass = () => (theme() === 'dark' ? 'dark' : '');

  // Global keyboard shortcut for command palette (Cmd/Ctrl+P)
  onMount(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        if (store.state.spec) {
          setCommandPaletteOpen((open) => !open);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleGlobalKeyDown));
  });

  // Initialize stores and handle OIDC callback on mount
  onMount(async () => {
    // Load persisted auth state from IndexedDB
    await authStore.actions.init();

    // Handle OIDC callback if present
    if (authStore.actions.hasPendingOidcCallback()) {
      const result = await authStore.actions.handleOpenIdCallback();
      if (!result.success && result.error) {
        setOidcError(result.error);
        // Clear error after 5 seconds
        setTimeout(() => setOidcError(null), 5000);
      }
    }
  });

  // Load spec from props if provided
  createEffect(() => {
    const spec = props.spec;
    if (spec) {
      store.actions.loadSpec(spec);
    }
  });

  // Handle URL deep linking after spec loads
  createEffect(() => {
    if (store.state.spec && !store.state.selectedOperation) {
      const urlParams = getParamsFromUrl();
      if (urlParams.operationId) {
        // Select server first if specified
        if (urlParams.serverIndex !== undefined) {
          store.actions.selectServerByIndex(urlParams.serverIndex);
        }
        // Then select the operation
        store.actions.selectOperationById(urlParams.operationId);
      }
    }
  });

  return (
    <div
      class={`${themeClass()} font-sans text-sm text-gray-800 dark:text-gray-100 min-h-screen w-full ${props.className ?? ''}`}
    >
      {/* iOS 26 Mesh gradient background */}
      <div class="fixed inset-0 bg-mesh -z-10" />
      <div class="fixed inset-0 pattern-dots -z-10" />

      {/* OIDC Error Toast */}
      <Show when={oidcError()}>
        <div class="fixed top-4 right-4 z-50 glass-card rounded-xl p-4 border border-red-200/30 dark:border-red-800/20 shadow-lg max-w-md animate-slide-in">
          <div class="flex items-start gap-3">
            <div class="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                class="w-4 h-4 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">OpenID Login Failed</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{oidcError()}</p>
            </div>
          </div>
        </div>
      </Show>

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

      {/* History Drawer */}
      <HistoryDrawer
        store={historyStore}
        open={historyOpen()}
        onClose={() => setHistoryOpen(false)}
        onReplay={(entry) => {
          // Find the operation by ID and select it
          const operation = store.state.spec?.operations.find(
            (op: Operation) => op.id === entry.operationId,
          );
          if (operation) {
            // Set replay values before selecting operation
            setReplayValues(entry.requestValues);
            store.actions.selectOperation(operation);
            setHistoryOpen(false);
          }
        }}
      />

      {/* Command Palette */}
      <Show when={store.state.spec}>
        <CommandPalette
          open={commandPaletteOpen()}
          onClose={() => setCommandPaletteOpen(false)}
          operations={store.state.spec?.operations ?? []}
          onSelectOperation={(op) => {
            store.actions.selectOperation(op);
            setCommandPaletteOpen(false);
          }}
          searchFn={store.search.searchOperations}
        />
      </Show>

      {/* Show spec loader when no spec is loaded */}
      <Show when={!store.state.spec && !store.state.loading && !store.state.error}>
        <SpecLoader store={store} />
      </Show>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div class="flex items-center justify-center h-screen">
      <div class="glass-card rounded-3xl p-8 flex flex-col items-center gap-5">
        <div class="relative">
          <div class="w-14 h-14 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30" />
          <div class="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        </div>
        <p class="text-gray-600 dark:text-gray-300 font-medium">Loading API specification...</p>
      </div>
    </div>
  );
}

function ErrorScreen(props: { error: string | null; onRetry?: () => void }) {
  return (
    <div class="flex items-center justify-center h-screen p-6">
      <div class="glass-card rounded-3xl p-8 max-w-lg border-red-200/30 dark:border-red-800/20">
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Failed to load API</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{props.error}</p>
            <Show when={props.onRetry}>
              <button
                type="button"
                onClick={props.onRetry}
                class="mt-4 px-4 py-2 text-sm font-medium rounded-xl glass-button text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Try again
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LayoutProps {
  store: SpecStore;
  authStore: AuthStore;
  historyStore: HistoryStore;
  onOpenHistory: () => void;
  replayValues?: RequestValues;
  onReplayValuesConsumed?: () => void;
}

function Layout(props: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);

  const selectedData = () => {
    const op = props.store.state.selectedOperation;
    const server = props.store.state.selectedServer;
    const serverVariables = props.store.state.serverVariables;
    if (op && server) {
      return { operation: op, server, serverVariables };
    }
    return null;
  };

  // Close mobile menu when operation is selected
  createEffect(() => {
    if (props.store.state.selectedOperation) {
      setMobileMenuOpen(false);
    }
  });

  // Track mobile/desktop state and close drawer when switching to desktop
  onMount(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setMobileMenuOpen(false);
      }
    };
    // Check initial state
    handleChange(mediaQuery);
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    onCleanup(() => mediaQuery.removeEventListener('change', handleChange));
  });

  const spec = () => props.store.state.spec;

  return (
    <div class="flex min-h-screen">
      {/* Mobile Header - visible only on mobile */}
      <div class="fixed top-0 left-0 right-0 z-40 md:hidden">
        <div class="flex items-center justify-between px-4 py-3 glass-sidebar border-b border-white/20 dark:border-white/5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            class="p-2 -ml-2 rounded-xl glass-button text-gray-600 dark:text-gray-300"
            aria-label="Open navigation menu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Show when={spec()}>
            <div class="flex-1 text-center min-w-0 px-4">
              <h1 class="font-semibold text-gray-900 dark:text-white truncate text-sm">
                {spec()?.info.title}
              </h1>
            </div>
          </Show>
          <button
            type="button"
            onClick={() => props.onOpenHistory()}
            class="p-2 -mr-2 rounded-xl glass-button text-gray-500 dark:text-gray-400"
            aria-label="Open history"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        open={mobileMenuOpen()}
        onClose={() => setMobileMenuOpen(false)}
        position="left"
        size="lg"
        showClose={false}
        noPadding
      >
        <Sidebar
          store={props.store}
          authStore={props.authStore}
          onOpenHistory={() => {
            setMobileMenuOpen(false);
            props.onOpenHistory();
          }}
          onClose={() => setMobileMenuOpen(false)}
        />
      </Drawer>

      {/* Desktop Sidebar - hidden on mobile */}
      <Show when={!isMobile()}>
        <aside class="w-80 flex-shrink-0 glass-sidebar border-r border-white/20 dark:border-white/5 h-screen sticky top-0 flex flex-col">
          <Sidebar
            store={props.store}
            authStore={props.authStore}
            onOpenHistory={props.onOpenHistory}
          />
        </aside>
      </Show>

      {/* Main content - add top padding on mobile for fixed header */}
      <main class="flex-1 overflow-y-auto pt-14 md:pt-0">
        <Show when={selectedData()} fallback={<WelcomeScreen />} keyed>
          {(data) => (
            <OperationPanel
              operation={data.operation}
              server={data.server}
              serverVariables={data.serverVariables}
              authStore={props.authStore}
              historyStore={props.historyStore}
              initialValues={props.replayValues}
              onInitialValuesConsumed={props.onReplayValuesConsumed}
            />
          )}
        </Show>
      </main>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div class="flex flex-col items-center justify-center h-full min-h-screen text-center p-8">
      <div class="glass-card rounded-[2rem] p-10 max-w-md">
        {/* Logo */}
        <div class="relative inline-flex mb-8">
          <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25 transform hover:scale-105 transition-spring">
            <svg
              class="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-15 blur-2xl -z-10" />
        </div>

        {/* Title */}
        <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-3">
          WTI
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 mb-6 font-medium">What The Interface</p>

        {/* Divider */}
        <div class="divider-glass my-8" />

        {/* Instructions */}
        <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
          Select an operation from the sidebar to explore and test API endpoints
        </p>

        {/* Keyboard hints */}
        <div class="mt-8 flex flex-col items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div class="inline-flex items-center gap-2.5">
            <kbd class="px-2.5 py-1.5 rounded-lg glass-button font-mono text-gray-600 dark:text-gray-300">
              /
            </kbd>
            <span>to search</span>
          </div>
          <div class="inline-flex items-center gap-2.5">
            <kbd class="px-2.5 py-1.5 rounded-lg glass-button font-mono text-gray-600 dark:text-gray-300">
              <span class="text-[10px]">Cmd</span>+P
            </kbd>
            <span>command palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
