/**
 * Request history store
 *
 * Stores request/response history with IndexedDB persistence and pagination.
 * Uses @wti/history for generic history management with a SolidJS reactive wrapper.
 */

import type { RequestConfig, RequestValues, ResponseData } from '@wti/core';
import { type BaseHistoryEntry, HistoryManager, createIndexedDBStorage } from '@wti/history';
import { createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

/**
 * WTI-specific history entry extending BaseHistoryEntry
 */
export interface HistoryEntry extends BaseHistoryEntry {
  operationId: string;
  operationPath: string;
  operationMethod: string;
  request: RequestConfig;
  /** Form values for replay */
  requestValues?: RequestValues;
  response?: ResponseData;
  error?: string;
}

export interface HistoryState {
  entries: HistoryEntry[];
}

export interface HistoryStore {
  state: HistoryState;
  actions: {
    /** Initialize store by loading first page from storage */
    init: () => Promise<void>;
    /** Load more entries (pagination) */
    loadMore: () => Promise<void>;
    /** Add a new entry to history */
    addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => Promise<string>;
    /** Update an existing entry (e.g., add response) */
    updateEntry: (
      id: string,
      update: Partial<Omit<HistoryEntry, 'id' | 'timestamp'>>,
    ) => Promise<void>;
    /** Remove an entry by ID */
    removeEntry: (id: string) => Promise<void>;
    /** Clear all history */
    clearHistory: () => Promise<void>;
    /** Get entry by ID */
    getEntry: (id: string) => HistoryEntry | undefined;
    /** Export history as JSON */
    exportHistory: () => Promise<string>;
    /** Import history from JSON */
    importHistory: (json: string) => Promise<boolean>;
    /** Check if store is loading */
    isLoading: () => boolean;
    /** Check if there are more entries to load */
    hasMore: () => boolean;
    /** Get total count of entries */
    getTotalCount: () => number;
  };
  loading: () => boolean;
  hasMore: () => boolean;
  totalCount: () => number;
}

/**
 * Validate that an entry has all required WTI-specific fields
 */
function validateHistoryEntry(entry: unknown): entry is HistoryEntry {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }

  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.timestamp === 'number' &&
    typeof e.operationId === 'string' &&
    e.request !== undefined
  );
}

// Shared storage instance for WTI (includes both history and auth stores)
const wtiStorage = createIndexedDBStorage({
  dbName: 'wti-storage',
  dbVersion: 1,
  stores: {
    history: {
      keyPath: 'id',
      indexes: [{ name: 'by-timestamp', keyPath: 'timestamp' }],
    },
    auth: {
      keyPath: 'id',
    },
  },
});

/**
 * Create the history store with SolidJS reactivity
 */
export function createHistoryStore(): HistoryStore {
  // Create the generic history manager
  const manager = new HistoryManager<HistoryEntry>({
    storage: wtiStorage,
    storeName: 'history',
    maxEntries: 500,
    pageSize: 20,
    timestampIndex: 'by-timestamp',
    validateEntry: validateHistoryEntry,
  });

  // SolidJS reactive state
  const [state, setState] = createStore<HistoryState>({
    entries: [],
  });

  const [loading, setLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [totalCount, setTotalCount] = createSignal(0);

  // Subscribe to manager state changes
  const unsubscribe = manager.subscribe((managerState) => {
    setState('entries', managerState.entries);
    setLoading(managerState.loading);
    setHasMore(managerState.hasMore);
    setTotalCount(managerState.totalCount);
  });

  // Cleanup subscription when component unmounts (if used in component context)
  if (typeof onCleanup === 'function') {
    try {
      onCleanup(unsubscribe);
    } catch {
      // onCleanup may fail if not in component context, which is fine
    }
  }

  return {
    state,
    actions: {
      init: () => manager.init(),
      loadMore: () => manager.loadMore(),
      addEntry: (entry) => manager.add(entry),
      updateEntry: (id, update) => manager.update(id, update),
      removeEntry: (id) => manager.remove(id),
      clearHistory: () => manager.clear(),
      getEntry: (id) => manager.get(id),
      exportHistory: () => manager.exportAll(),
      importHistory: (json) => manager.importFromJson(json),
      isLoading: loading,
      hasMore,
      getTotalCount: totalCount,
    },
    loading,
    hasMore,
    totalCount,
  };
}

// Re-export the shared storage for use by auth store
export { wtiStorage };
