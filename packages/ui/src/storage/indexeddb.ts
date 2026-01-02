/**
 * IndexedDB storage backend implementation
 *
 * Uses the idb library for a cleaner Promise-based API
 */

import { type IDBPDatabase, openDB } from 'idb';
import type { PageOptions, StorageBackend } from './types';

const DB_NAME = 'wti-storage';
const DB_VERSION = 1;

// Check if IndexedDB is available (not in SSR/Node)
const isIndexedDBAvailable = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';

/**
 * Initialize the IndexedDB database
 */
async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create auth store
      if (!db.objectStoreNames.contains('auth')) {
        db.createObjectStore('auth', { keyPath: 'id' });
      }

      // Create history store with timestamp index
      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', { keyPath: 'id' });
        historyStore.createIndex('by-timestamp', 'timestamp');
      }
    },
  });
}

// Singleton database instance
let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!isIndexedDBAvailable) {
    return Promise.reject(new Error('IndexedDB is not available'));
  }
  if (!dbPromise) {
    dbPromise = initDB().catch((err) => {
      // Reset promise on failure so it can be retried
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

/**
 * Log storage errors once per session to avoid spam
 */
let hasLoggedError = false;
function logStorageError(operation: string, error: unknown): void {
  if (!hasLoggedError) {
    console.warn(
      `[WTI Storage] IndexedDB ${operation} failed. App will continue without persistence.`,
      error,
    );
    hasLoggedError = true;
  }
}

/**
 * IndexedDB storage backend
 *
 * All methods are resilient to failures - they return safe defaults
 * instead of throwing, so the app continues to work without persistence.
 */
export const indexedDBStorage: StorageBackend = {
  async get<T>(store: string, key: string): Promise<T | null> {
    try {
      const db = await getDB();
      const value = await db.get(store, key);
      return (value as T) ?? null;
    } catch (error) {
      logStorageError('get', error);
      return null;
    }
  },

  async set<T>(store: string, key: string, value: T): Promise<void> {
    try {
      const db = await getDB();
      // Ensure the value has the key field for keyPath
      const valueWithKey = { ...(value as object), id: key };
      await db.put(store, valueWithKey);
    } catch (error) {
      logStorageError('set', error);
    }
  },

  async remove(store: string, key: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete(store, key);
    } catch (error) {
      logStorageError('remove', error);
    }
  },

  async clear(store: string): Promise<void> {
    try {
      const db = await getDB();
      await db.clear(store);
    } catch (error) {
      logStorageError('clear', error);
    }
  },

  async getPage<T>(store: string, options: PageOptions): Promise<T[]> {
    try {
      const db = await getDB();
      const { limit, offset = 0, index, direction = 'prev' } = options;

      const tx = db.transaction(store, 'readonly');
      const objectStore = tx.objectStore(store);

      // Use index if specified, otherwise use store directly
      const source = index ? objectStore.index(index) : objectStore;

      const results: T[] = [];
      let skipped = 0;

      // Open cursor with direction
      let cursor = await source.openCursor(null, direction);

      while (cursor && results.length < limit) {
        if (skipped < offset) {
          skipped++;
        } else {
          results.push(cursor.value as T);
        }
        cursor = await cursor.continue();
      }

      await tx.done;
      return results;
    } catch (error) {
      logStorageError('getPage', error);
      return [];
    }
  },

  async count(store: string): Promise<number> {
    try {
      const db = await getDB();
      return db.count(store);
    } catch (error) {
      logStorageError('count', error);
      return 0;
    }
  },

  async getAll<T>(store: string): Promise<T[]> {
    try {
      const db = await getDB();
      const values = await db.getAll(store);
      return values as T[];
    } catch (error) {
      logStorageError('getAll', error);
      return [];
    }
  },
};

/**
 * Reset database (for testing/debugging)
 */
export async function resetDatabase(): Promise<void> {
  if (!isIndexedDBAvailable) {
    return;
  }
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
  await indexedDB.deleteDatabase(DB_NAME);
}
