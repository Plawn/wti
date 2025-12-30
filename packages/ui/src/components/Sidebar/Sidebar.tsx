import type { Component } from 'solid-js';
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
  const spec = () => {
    const s = props.store.state.spec;
    if (!s) throw new Error('Sidebar rendered without spec');
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
          onChange={props.store.actions.selectServer}
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
