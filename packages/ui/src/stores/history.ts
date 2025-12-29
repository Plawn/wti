/**
 * Request history store
 *
 * Stores request/response history with IndexedDB persistence and pagination
 */

import type { RequestConfig, RequestValues, ResponseData } from '@wti/core';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { storage } from '../storage';

const STORAGE_STORE = 'history';
const PAGE_SIZE = 20;
const MAX_ENTRIES = 500;

export interface HistoryEntry {
  id: string;
  timestamp: number;
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
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create the history store
 */
export function createHistoryStore(): HistoryStore {
  const [state, setState] = createStore<HistoryState>({
    entries: [],
  });

  const [loading, setLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [totalCount, setTotalCount] = createSignal(0);
  const [initialized, setInitialized] = createSignal(false);

  /**
   * Initialize store by loading first page from storage
   */
  const init = async (): Promise<void> => {
    if (initialized()) return;

    setLoading(true);
    try {
      // Get total count
      const count = await storage.count(STORAGE_STORE);
      setTotalCount(count);

      // Load first page
      const entries = await storage.getPage<HistoryEntry>(STORAGE_STORE, {
        limit: PAGE_SIZE,
        index: 'by-timestamp',
        direction: 'prev', // Most recent first
      });

      setState('entries', entries);
      setHasMore(entries.length >= PAGE_SIZE && entries.length < count);
    } catch (error) {
      console.warn('Failed to load history from storage:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  /**
   * Load more entries (pagination)
   */
  const loadMore = async (): Promise<void> => {
    if (loading() || !hasMore()) return;

    setLoading(true);
    try {
      const currentCount = state.entries.length;
      const entries = await storage.getPage<HistoryEntry>(STORAGE_STORE, {
        limit: PAGE_SIZE,
        offset: currentCount,
        index: 'by-timestamp',
        direction: 'prev',
      });

      if (entries.length > 0) {
        setState('entries', (prev) => [...prev, ...entries]);
      }

      const total = await storage.count(STORAGE_STORE);
      setTotalCount(total);
      setHasMore(state.entries.length + entries.length < total);
    } catch (error) {
      console.warn('Failed to load more history:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new entry to history
   */
  const addEntry = async (entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<string> => {
    const id = generateId();
    const newEntry: HistoryEntry = {
      ...entry,
      id,
      timestamp: Date.now(),
    };

    // Add to IndexedDB
    await storage.set(STORAGE_STORE, id, newEntry);

    // Add to state (at the beginning since it's newest)
    setState('entries', (entries) => [newEntry, ...entries]);

    // Update total count
    setTotalCount((c) => c + 1);

    // Prune old entries if over max
    const total = await storage.count(STORAGE_STORE);
    if (total > MAX_ENTRIES) {
      // Get oldest entries to remove
      const oldest = await storage.getPage<HistoryEntry>(STORAGE_STORE, {
        limit: total - MAX_ENTRIES,
        index: 'by-timestamp',
        direction: 'next', // Oldest first
      });

      for (const old of oldest) {
        await storage.remove(STORAGE_STORE, old.id);
      }

      setTotalCount(MAX_ENTRIES);
    }

    return id;
  };

  /**
   * Update an existing entry (e.g., add response)
   */
  const updateEntry = async (
    id: string,
    update: Partial<Omit<HistoryEntry, 'id' | 'timestamp'>>,
  ): Promise<void> => {
    // Update in state
    const entryIndex = state.entries.findIndex((e) => e.id === id);
    if (entryIndex !== -1) {
      const updatedEntry = { ...state.entries[entryIndex], ...update };
      setState('entries', entryIndex, updatedEntry);

      // Update in storage
      await storage.set(STORAGE_STORE, id, updatedEntry);
    } else {
      // Entry not in state, try to update in storage directly
      const existing = await storage.get<HistoryEntry>(STORAGE_STORE, id);
      if (existing) {
        const updatedEntry = { ...existing, ...update };
        await storage.set(STORAGE_STORE, id, updatedEntry);
      }
    }
  };

  /**
   * Remove an entry by ID
   */
  const removeEntry = async (id: string): Promise<void> => {
    // Remove from state
    setState('entries', (entries) => entries.filter((e) => e.id !== id));

    // Remove from storage
    await storage.remove(STORAGE_STORE, id);

    // Update count
    setTotalCount((c) => Math.max(0, c - 1));
  };

  /**
   * Clear all history
   */
  const clearHistory = async (): Promise<void> => {
    setState('entries', []);
    await storage.clear(STORAGE_STORE);
    setTotalCount(0);
    setHasMore(false);
  };

  /**
   * Get entry by ID (from loaded entries only)
   */
  const getEntry = (id: string): HistoryEntry | undefined => {
    return state.entries.find((entry) => entry.id === id);
  };

  /**
   * Export history as JSON
   */
  const exportHistory = async (): Promise<string> => {
    // Get all entries from storage
    const allEntries = await storage.getAll<HistoryEntry>(STORAGE_STORE);
    // Sort by timestamp descending
    allEntries.sort((a, b) => b.timestamp - a.timestamp);
    return JSON.stringify(allEntries, null, 2);
  };

  /**
   * Import history from JSON
   */
  const importHistory = async (json: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) {
        return false;
      }

      // Validate entries have required fields
      const valid = parsed.every(
        (entry) =>
          typeof entry.id === 'string' &&
          typeof entry.timestamp === 'number' &&
          typeof entry.operationId === 'string' &&
          entry.request,
      );

      if (!valid) {
        return false;
      }

      // Clear existing and import new
      await storage.clear(STORAGE_STORE);

      // Import entries (limit to MAX_ENTRIES)
      const toImport = parsed.slice(0, MAX_ENTRIES);
      for (const entry of toImport) {
        await storage.set(STORAGE_STORE, entry.id, entry);
      }

      // Reload state
      setInitialized(false);
      await init();

      return true;
    } catch {
      return false;
    }
  };

  return {
    state,
    actions: {
      init,
      loadMore,
      addEntry,
      updateEntry,
      removeEntry,
      clearHistory,
      getEntry,
      exportHistory,
      importHistory,
      isLoading: loading,
      hasMore,
      getTotalCount: totalCount,
    },
    loading,
    hasMore,
    totalCount,
  };
}
