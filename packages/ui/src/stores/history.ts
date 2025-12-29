/**
 * Request history store
 *
 * Stores request/response history with localStorage persistence
 */

import type { RequestConfig, RequestValues, ResponseData } from '@wti/core';
import { createStore } from 'solid-js/store';

const STORAGE_KEY = 'wti-request-history';
const MAX_ENTRIES = 100;

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
    /** Add a new entry to history */
    addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => string;
    /** Update an existing entry (e.g., add response) */
    updateEntry: (id: string, update: Partial<Omit<HistoryEntry, 'id' | 'timestamp'>>) => void;
    /** Remove an entry by ID */
    removeEntry: (id: string) => void;
    /** Clear all history */
    clearHistory: () => void;
    /** Get entry by ID */
    getEntry: (id: string) => HistoryEntry | undefined;
    /** Export history as JSON */
    exportHistory: () => string;
    /** Import history from JSON */
    importHistory: (json: string) => boolean;
  };
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load history from localStorage
 */
function loadFromStorage(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load history from localStorage:', e);
  }
  return [];
}

/**
 * Save history to localStorage
 */
function saveToStorage(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn('Failed to save history to localStorage:', e);
  }
}

/**
 * Create the history store
 */
export function createHistoryStore(): HistoryStore {
  const [state, setState] = createStore<HistoryState>({
    entries: loadFromStorage(),
  });

  const addEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>): string => {
    const id = generateId();
    const newEntry: HistoryEntry = {
      ...entry,
      id,
      timestamp: Date.now(),
    };

    setState('entries', (entries) => {
      // Add new entry at the beginning, limit to MAX_ENTRIES
      const updated = [newEntry, ...entries].slice(0, MAX_ENTRIES);
      saveToStorage(updated);
      return updated;
    });

    return id;
  };

  const updateEntry = (id: string, update: Partial<Omit<HistoryEntry, 'id' | 'timestamp'>>): void => {
    setState('entries', (entries) => {
      const updated = entries.map((entry) =>
        entry.id === id ? { ...entry, ...update } : entry
      );
      saveToStorage(updated);
      return updated;
    });
  };

  const removeEntry = (id: string): void => {
    setState('entries', (entries) => {
      const updated = entries.filter((entry) => entry.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const clearHistory = (): void => {
    setState('entries', []);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getEntry = (id: string): HistoryEntry | undefined => {
    return state.entries.find((entry) => entry.id === id);
  };

  const exportHistory = (): string => {
    return JSON.stringify(state.entries, null, 2);
  };

  const importHistory = (json: string): boolean => {
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
          entry.request
      );
      if (!valid) {
        return false;
      }
      setState('entries', parsed.slice(0, MAX_ENTRIES));
      saveToStorage(state.entries);
      return true;
    } catch {
      return false;
    }
  };

  return {
    state,
    actions: {
      addEntry,
      updateEntry,
      removeEntry,
      clearHistory,
      getEntry,
      exportHistory,
      importHistory,
    },
  };
}
