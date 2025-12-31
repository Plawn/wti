import type { RequestValues } from '@wti/core';
import type { Component } from 'solid-js';
import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import type { AuthStore, HistoryStore, SpecStore } from '../stores';
import { OperationPanel } from './Operation';
import { Sidebar } from './Sidebar';
import { WelcomeScreen } from './screens';
import { Drawer } from './shared';

export interface LayoutProps {
  store: SpecStore;
  authStore: AuthStore;
  historyStore: HistoryStore;
  onOpenHistory: () => void;
  replayValues?: RequestValues;
  onReplayValuesConsumed?: () => void;
}

export const Layout: Component<LayoutProps> = (props) => {
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
    const mediaQuery = window.matchMedia('(max-width: 47.9375rem)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setMobileMenuOpen(false);
      }
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    onCleanup(() => mediaQuery.removeEventListener('change', handleChange));
  });

  const spec = () => props.store.state.spec;

  return (
    <div class="flex min-h-screen">
      <MobileHeader
        title={spec()?.info.title}
        onMenuOpen={() => setMobileMenuOpen(true)}
        onHistoryOpen={props.onOpenHistory}
      />

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

      {/* Desktop Sidebar */}
      <Show when={!isMobile()}>
        <aside class="w-80 flex-shrink-0 glass-sidebar border-r border-white/20 dark:border-white/5 h-screen sticky top-0 flex flex-col">
          <Sidebar
            store={props.store}
            authStore={props.authStore}
            onOpenHistory={props.onOpenHistory}
          />
        </aside>
      </Show>

      {/* Main content */}
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
};

interface MobileHeaderProps {
  title?: string;
  onMenuOpen: () => void;
  onHistoryOpen: () => void;
}

const MobileHeader: Component<MobileHeaderProps> = (props) => {
  return (
    <div class="fixed top-0 left-0 right-0 z-40 md:hidden">
      <div class="flex items-center justify-between px-4 py-3 glass-sidebar border-b border-white/20 dark:border-white/5">
        <button
          type="button"
          onClick={props.onMenuOpen}
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
        <Show when={props.title}>
          <div class="flex-1 text-center min-w-0 px-4">
            <h1 class="font-semibold text-gray-900 dark:text-white truncate text-sm">
              {props.title}
            </h1>
          </div>
        </Show>
        <button
          type="button"
          onClick={props.onHistoryOpen}
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
  );
};
