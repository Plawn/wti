import type { Component } from 'solid-js';
import type { AuthStore, SpecStore } from '../../stores';
import { AuthPanel } from './AuthPanel';
import { OperationTree } from './OperationTree';
import { SearchBar } from './SearchBar';
import { ServerSelector } from './ServerSelector';

interface SidebarProps {
  store: SpecStore;
  authStore: AuthStore;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const spec = () => {
    const s = props.store.state.spec;
    if (!s) throw new Error('Sidebar rendered without spec');
    return s;
  };

  return (
    <div class="flex flex-col h-screen">
      {/* Header */}
      <header class="flex-shrink-0 px-5 py-5">
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg
              class="w-6 h-6 text-white"
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
            <h1 class="font-semibold text-gray-900 dark:text-white truncate leading-tight text-base">
              {spec().info.title}
            </h1>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              v{spec().info.version}
            </span>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div class="mx-5 divider-glass" />

      {/* Controls */}
      <div class="flex-shrink-0 px-5 py-4 space-y-4">
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
      <div class="mx-5 divider-glass" />

      {/* Auth Panel */}
      <AuthPanel authStore={props.authStore} securitySchemes={spec().securitySchemes} />

      {/* Divider */}
      <div class="mx-5 divider-glass" />

      {/* Operations list */}
      <div class="flex-1 overflow-hidden">
        <OperationTree
          operations={spec().operations}
          expandedTags={props.store.state.expandedTags}
          selectedOperationId={props.store.state.selectedOperation?.id || null}
          searchQuery={props.store.state.searchQuery}
          onToggleTag={props.store.actions.toggleTag}
          onSelectOperation={props.store.actions.selectOperation}
        />
      </div>
    </div>
  );
};
