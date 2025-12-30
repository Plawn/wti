import type { Component } from 'solid-js';
import { useTheme } from '../../context';
import { useI18n } from '../../i18n';
import type { AuthStore, SpecStore } from '../../stores';
import { AuthPanel } from './AuthPanel';
import { OperationTree } from './OperationTree';
import { SearchBar } from './SearchBar';
import { ServerSelector } from './ServerSelector';

interface SidebarProps {
  store: SpecStore;
  authStore: AuthStore;
  onOpenHistory?: () => void;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  const spec = () => {
    const s = props.store.state.spec;
    if (!s) {
      throw new Error('Sidebar rendered without spec');
    }
    return s;
  };

  return (
    <div class="flex flex-col h-full overflow-hidden">
      {/* Header - bottom on mobile, top on desktop */}
      <header class="order-last md:order-first flex-shrink-0 px-4 md:px-5 py-3 md:py-4 overflow-hidden border-t md:border-t-0 border-gray-200 dark:border-white/5">
        <div class="flex items-center gap-2.5 md:gap-3 flex-nowrap">
          <div class="w-9 h-9 md:w-11 md:h-11 shrink-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg
              class="w-5 h-5 md:w-6 md:h-6 text-white"
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
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="font-semibold text-gray-900 dark:text-white truncate leading-tight text-sm md:text-base">
              {spec().info.title}
            </h1>
            <span class="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">
              v{spec().info.version}
            </span>
          </div>
          {/* Theme toggle button */}
          <button
            type="button"
            onClick={toggleTheme}
            class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl glass-button flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors overflow-hidden"
            aria-label={
              theme() === 'dark' ? t('sidebar.toggleThemeLight') : t('sidebar.toggleThemeDark')
            }
            title={
              theme() === 'dark' ? t('sidebar.toggleThemeLight') : t('sidebar.toggleThemeDark')
            }
          >
            <div class="relative w-4 h-4 md:w-5 md:h-5">
              {/* Sun icon - visible in dark mode */}
              <svg
                class={`absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${theme() === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {/* Moon icon - visible in light mode */}
              <svg
                class={`absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${theme() === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
          </button>
          {/* History button */}
          <button
            type="button"
            onClick={() => props.onOpenHistory?.()}
            class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl glass-button flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            title="Request History"
          >
            <svg
              class="w-4 h-4 md:w-5 md:h-5"
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
      </header>

      {/* Divider - hidden on mobile since header is at bottom */}
      <div class="hidden md:block mx-5 divider-glass" />

      {/* Controls */}
      <div class="flex-shrink-0 px-4 md:px-5 py-2 md:py-3 space-y-2 md:space-y-3">
        <ServerSelector
          servers={spec().servers}
          selectedUrl={props.store.state.selectedServer?.url || null}
          serverVariables={props.store.state.serverVariables}
          onChange={props.store.actions.selectServer}
          onVariableChange={props.store.actions.setServerVariable}
        />
        <SearchBar
          value={props.store.state.searchQuery}
          onInput={props.store.actions.setSearchQuery}
        />
      </div>

      {/* Divider */}
      <div class="mx-4 md:mx-6 divider-glass" />

      {/* Auth Panel */}
      <div class="px-1">
        <AuthPanel authStore={props.authStore} securitySchemes={spec().securitySchemes} />
      </div>

      {/* Divider */}
      <div class="mx-4 md:mx-6 divider-glass" />

      {/* Operations list */}
      <div class="flex-1 overflow-hidden">
        <OperationTree
          operations={spec().operations}
          expandedTags={props.store.state.expandedTags}
          selectedOperationId={props.store.state.selectedOperation?.id || null}
          searchQuery={props.store.state.searchQuery}
          onToggleTag={props.store.actions.toggleTag}
          onSelectOperation={props.store.actions.selectOperation}
          searchFn={props.store.search.searchOperations}
        />
      </div>
    </div>
  );
};
