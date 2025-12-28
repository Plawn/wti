import type { ApiSpec, Operation, Server, SpecInput } from '@wti/core';
import { parseOpenApi } from '@wti/core';
import { createStore } from 'solid-js/store';

export interface SpecState {
  spec: ApiSpec | null;
  loading: boolean;
  error: string | null;
  selectedOperation: Operation | null;
  selectedServer: Server | null;
  searchQuery: string;
  expandedTags: Set<string>;
}

const initialState: SpecState = {
  spec: null,
  loading: false,
  error: null,
  selectedOperation: null,
  selectedServer: null,
  searchQuery: '',
  expandedTags: new Set(),
};

export function createSpecStore() {
  const [state, setState] = createStore<SpecState>(initialState);

  const actions = {
    setSpec(spec: ApiSpec) {
      setState({
        spec,
        loading: false,
        error: null,
        selectedServer: spec.servers[0] || null,
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
    },

    selectServer(server: Server) {
      setState({ selectedServer: server });
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
          throw new Error('gRPC support not yet implemented');
        }
      } catch (err) {
        setState({
          error: err instanceof Error ? err.message : 'Failed to load spec',
          loading: false,
        });
      }
    },
  };

  return { state, actions };
}

export type SpecStore = ReturnType<typeof createSpecStore>;
