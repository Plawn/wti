import type { Component } from 'solid-js';
import type { AuthStore, SpecStore } from '../../stores';
import { AuthPanel } from './AuthPanel';
import { OperationTree } from './OperationTree';
import { SearchBar } from './SearchBar';
import { ServerSelector } from './ServerSelector';
import { SidebarHeader } from './SidebarHeader';

interface SidebarProps {
  store: SpecStore;
  authStore: AuthStore;
  onOpenHistory?: () => void;
  /** Close callback for mobile drawer */
  onClose?: () => void;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const spec = () => {
    const s = props.store.state.spec;
    if (!s) {
      throw new Error('Sidebar rendered without spec');
    }
    return s;
  };

  return (
    <div class="flex flex-col-reverse md:flex-col flex-1 min-h-0">
      {/* Header - at bottom on mobile (via flex-col-reverse), at top on desktop */}
      <SidebarHeader spec={spec()} onOpenHistory={props.onOpenHistory} onClose={props.onClose} />

      {/* Scrollable content area */}
      <div class="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {/* Divider - hidden on mobile since header is at bottom */}
        <div class="hidden md:block mx-4 divider-glass" />

        {/* Controls */}
        <div class="sticky top-0 z-10 glass-surface flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2">
          <ServerSelector
            servers={spec().servers}
            selectedUrl={props.store.state.selectedServer?.url || null}
            serverVariables={props.store.state.serverVariables}
            onChange={props.store.actions.selectServer}
            onVariableChange={props.store.actions.setServerVariable}
            hideLabel
            className="w-1/3 min-w-[120px]"
          />
          <div class="flex-1">
            <SearchBar
              value={props.store.state.searchQuery}
              onInput={props.store.actions.setSearchQuery}
            />
          </div>
        </div>

        {/* Divider */}
        <div class="mx-3 md:mx-4 divider-glass" />

        {/* Auth Panel */}
        <div class="px-0.5">
          <AuthPanel authStore={props.authStore} securitySchemes={spec().securitySchemes} />
        </div>

        {/* Divider */}
        <div class="mx-3 md:mx-4 divider-glass" />

        {/* Operations list */}
        <div class="flex-1 min-h-0">
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
    </div>
  );
};
