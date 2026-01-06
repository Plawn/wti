import type { ApiSpec, Operation, Server, SpecInput } from '@wti/core';
import { loadGrpcSpec, parseOpenApi } from '@wti/core';
import type Fuse from 'fuse.js';
import { createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { createOperationSearch, searchOperations } from '../utils/search';
import { clearUrlParams, updateUrlWithParams } from '../utils/url';

export interface SpecState {
  spec: ApiSpec | null;
  loading: boolean;
  error: string | null;
  selectedOperation: Operation | null;
  selectedServer: Server | null;
  serverVariables: Record<string, string>;
  searchQuery: string;
  expandedTags: Set<string>;
}

const initialState: SpecState = {
  spec: null,
  loading: false,
  error: null,
  selectedOperation: null,
  selectedServer: null,
  serverVariables: {},
  searchQuery: '',
  expandedTags: new Set(),
};

/**
 * Extract default variable values from a server
 */
function getDefaultServerVariables(server: Server | null): Record<string, string> {
  if (!server?.variables) {
    return {};
  }
  const defaults: Record<string, string> = {};
  for (const [name, variable] of Object.entries(server.variables)) {
    defaults[name] = variable.default;
  }
  return defaults;
}

export function createSpecStore() {
  const [state, setState] = createStore<SpecState>(initialState);

  // Memoized Fuse.js instance - shared across all components using this store
  const fuse = createMemo(() => {
    if (!state.spec) {
      return null;
    }
    return createOperationSearch(state.spec.operations);
  });

  const actions = {
    setSpec(spec: ApiSpec) {
      const firstServer = spec.servers[0] || null;
      setState({
        spec,
        loading: false,
        error: null,
        selectedServer: firstServer,
        serverVariables: getDefaultServerVariables(firstServer),
      });
      // Expand all tags by default
      actions.expandAllTags();
    },

    setLoading(loading: boolean) {
      setState({ loading });
    },

    setError(error: string) {
      setState({ error, loading: false });
    },

    clearError() {
      setState({ error: null });
    },

    selectOperation(operation: Operation | null) {
      setState({ selectedOperation: operation });
      // Sync URL with selected operation
      if (operation) {
        const serverIndex =
          state.selectedServer && state.spec?.servers
            ? state.spec.servers.indexOf(state.selectedServer)
            : 0;
        updateUrlWithParams({ operationId: operation.id, serverIndex });
      } else {
        clearUrlParams();
      }
    },

    /**
     * Select an operation by its ID
     * Returns true if operation was found and selected
     */
    selectOperationById(operationId: string): boolean {
      const operation = state.spec?.operations.find((op: Operation) => op.id === operationId);
      if (operation) {
        this.selectOperation(operation);
        return true;
      }
      return false;
    },

    selectServer(server: Server) {
      setState({
        selectedServer: server,
        serverVariables: getDefaultServerVariables(server),
      });
      // Update URL with new server index
      if (state.selectedOperation) {
        const serverIndex = state.spec?.servers.indexOf(server) ?? 0;
        updateUrlWithParams({ operationId: state.selectedOperation.id, serverIndex });
      }
    },

    /**
     * Set a server variable value
     */
    setServerVariable(name: string, value: string) {
      setState('serverVariables', name, value);
    },

    /**
     * Select a server by its index
     */
    selectServerByIndex(index: number): boolean {
      const server = state.spec?.servers[index];
      if (server) {
        this.selectServer(server);
        return true;
      }
      return false;
    },

    setSearchQuery(query: string) {
      setState({ searchQuery: query });
    },

    toggleTag(tag: string) {
      const newSet = new Set(state.expandedTags);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      setState({ expandedTags: newSet });
    },

    expandAllTags() {
      if (state.spec) {
        const allTags = new Set<string>();
        // Add defined tags
        for (const tag of state.spec.tags) {
          allTags.add(tag.name);
        }
        // Add implicit tags from operations
        for (const op of state.spec.operations) {
          for (const tag of op.tags) {
            allTags.add(tag);
          }
        }
        setState({ expandedTags: allTags });
      }
    },

    collapseAllTags() {
      setState({ expandedTags: new Set() });
    },

    async loadSpec(input: SpecInput) {
      setState({ loading: true, error: null });
      try {
        if (input.type === 'openapi') {
          const result = await parseOpenApi(input);
          actions.setSpec(result.spec);
        } else if (input.type === 'grpc') {
          const spec = await loadGrpcSpec(input.endpoint);
          actions.setSpec(spec);
        }
      } catch (err) {
        setState({
          error: err instanceof Error ? err.message : 'Failed to load spec',
          loading: false,
        });
      }
    },
  };

  // Search utilities using the memoized Fuse instance
  const search = {
    /** Get the memoized Fuse instance (for advanced use cases) */
    getFuse: () => fuse() as Fuse<Operation> | null,
    /** Search operations with the given query */
    searchOperations: (query: string, limit = 50) => {
      const fuseInstance = fuse();
      if (!fuseInstance) {
        return [];
      }
      return searchOperations(fuseInstance, query, limit);
    },
  };

  return { state, actions, search };
}

export type SpecStore = ReturnType<typeof createSpecStore>;
