import { createStore } from 'solid-js/store';
import type { ApiSpec, Operation, SpecInput } from '@wti/core';

export interface SpecState {
  spec: ApiSpec | null;
  loading: boolean;
  error: string | null;
  selectedOperation: Operation | null;
  searchQuery: string;
  expandedTags: Set<string>;
}

const initialState: SpecState = {
  spec: null,
  loading: false,
  error: null,
  selectedOperation: null,
  searchQuery: '',
  expandedTags: new Set(),
};

export function createSpecStore() {
  const [state, setState] = createStore<SpecState>(initialState);

  const actions = {
    setSpec(spec: ApiSpec) {
      setState({ spec, loading: false, error: null });
    },

    setLoading(loading: boolean) {
      setState({ loading });
    },

    setError(error: string) {
      setState({ error, loading: false });
    },

    selectOperation(operation: Operation | null) {
      setState({ selectedOperation: operation });
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
        setState({ expandedTags: new Set(state.spec.tags.map((t) => t.name)) });
      }
    },

    collapseAllTags() {
      setState({ expandedTags: new Set() });
    },

    async loadSpec(input: SpecInput) {
      setState({ loading: true, error: null });
      try {
        // TODO: Implement actual spec loading
        // For now, this is a placeholder
        console.log('Loading spec:', input);
        throw new Error('Spec loading not yet implemented');
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
