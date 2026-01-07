/**
 * IndexedDB storage backend implementation
 *
 * Uses the idb library for a cleaner Promise-based API.
 * Configurable database schema via IndexedDBConfig.
 */

import { type IDBPDatabase, openDB } from 'idb';
import type { IndexedDBConfig, PageOptions, StorageBackend } from './types';

// Check if IndexedDB is available (not in SSR/Node)
const isIndexedDBAvailable = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';

/**
 * Log storage errors once per database to avoid spam
 */
const loggedErrors = new Set<string>();

function logStorageError(dbName: string, operation: string, error: unknown): void {
  const key = `${dbName}:${operation}`;
  if (!loggedErrors.has(key)) {
    console.warn(
      `[History Storage] IndexedDB ${operation} failed for "${dbName}". App will continue without persistence.`,
      error,
    );
    loggedErrors.add(key);
  }
}

/**
 * Create an IndexedDB storage backend with custom configuration
 *
 * @param config - Database configuration including name, version, and stores
 * @returns StorageBackend implementation using IndexedDB
 *
 * @example
 * ```typescript
 * const storage = createIndexedDBStorage({
 *   dbName: 'my-app',
 *   dbVersion: 1,
 *   stores: {
 *     history: {
 *       keyPath: 'id',
 *       indexes: [{ name: 'by-timestamp', keyPath: 'timestamp' }],
 *     },
 *   },
 * });
 * ```
 */
export function createIndexedDBStorage(config: IndexedDBConfig): StorageBackend {
  const { dbName, dbVersion, stores } = config;

  // Database promise (lazy initialization)
  let dbPromise: Promise<IDBPDatabase> | null = null;

  async function initDB(): Promise<IDBPDatabase> {
    return openDB(dbName, dbVersion, {
      upgrade(db) {
        // Create stores based on configuration
        for (const [storeName, storeConfig] of Object.entries(stores)) {
          if (!db.objectStoreNames.contains(storeName)) {
            const objectStore = db.createObjectStore(storeName, {
              keyPath: storeConfig.keyPath,
            });

            // Create indexes
            if (storeConfig.indexes) {
              for (const indexConfig of storeConfig.indexes) {
                objectStore.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options);
              }
            }
          }
        }
      },
    });
  }

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

  return {
    async get<T>(store: string, key: string): Promise<T | null> {
      try {
        const db = await getDB();
        const value = await db.get(store, key);
        return (value as T) ?? null;
      } catch (error) {
        logStorageError(dbName, 'get', error);
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
        logStorageError(dbName, 'set', error);
      }
    },

    async remove(store: string, key: string): Promise<void> {
      try {
        const db = await getDB();
        await db.delete(store, key);
      } catch (error) {
        logStorageError(dbName, 'remove', error);
      }
    },

    async clear(store: string): Promise<void> {
      try {
        const db = await getDB();
        await db.clear(store);
      } catch (error) {
        logStorageError(dbName, 'clear', error);
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
        logStorageError(dbName, 'getPage', error);
        return [];
      }
    },

    async count(store: string): Promise<number> {
      try {
        const db = await getDB();
        return db.count(store);
      } catch (error) {
        logStorageError(dbName, 'count', error);
        return 0;
      }
    },

    async getAll<T>(store: string): Promise<T[]> {
      try {
        const db = await getDB();
        const values = await db.getAll(store);
        return values as T[];
      } catch (error) {
        logStorageError(dbName, 'getAll', error);
        return [];
      }
    },
  };
}
