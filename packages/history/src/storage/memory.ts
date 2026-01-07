/**
 * In-memory storage backend for testing and SSR scenarios
 */

import type { PageOptions, StorageBackend } from './types';

interface MemoryStore {
  data: Map<string, unknown>;
}

/**
 * Create an in-memory storage backend
 *
 * Useful for:
 * - Unit testing without IndexedDB
 * - Server-side rendering
 * - Temporary storage that doesn't persist
 */
export function createMemoryStorage(): StorageBackend {
  const stores = new Map<string, MemoryStore>();

  function getStore(name: string): MemoryStore {
    let store = stores.get(name);
    if (!store) {
      store = { data: new Map() };
      stores.set(name, store);
    }
    return store;
  }

  return {
    async get<T>(store: string, key: string): Promise<T | null> {
      const s = getStore(store);
      const value = s.data.get(key);
      return (value as T) ?? null;
    },

    async set<T>(store: string, key: string, value: T): Promise<void> {
      const s = getStore(store);
      s.data.set(key, value);
    },

    async remove(store: string, key: string): Promise<void> {
      const s = getStore(store);
      s.data.delete(key);
    },

    async clear(store: string): Promise<void> {
      const s = getStore(store);
      s.data.clear();
    },

    async getPage<T>(store: string, options: PageOptions): Promise<T[]> {
      const s = getStore(store);
      const { limit, offset = 0, index, direction = 'prev' } = options;

      // Get all values as array
      const entries = Array.from(s.data.values()) as Array<T & { timestamp?: number }>;

      // Sort by timestamp if index is specified (assume 'by-timestamp' means sort by timestamp)
      if (index === 'by-timestamp') {
        entries.sort((a, b) => {
          const aTime = a.timestamp ?? 0;
          const bTime = b.timestamp ?? 0;
          return direction === 'prev' ? bTime - aTime : aTime - bTime;
        });
      }

      // Apply pagination
      return entries.slice(offset, offset + limit) as T[];
    },

    async count(store: string): Promise<number> {
      const s = getStore(store);
      return s.data.size;
    },

    async getAll<T>(store: string): Promise<T[]> {
      const s = getStore(store);
      return Array.from(s.data.values()) as T[];
    },
  };
}
