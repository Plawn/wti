/**
 * IndexedDB storage backend implementation
 *
 * Uses the idb library for a cleaner Promise-based API
 */

import { type IDBPDatabase, openDB } from 'idb';
import type { PageOptions, StorageBackend } from './types';

const DB_NAME = 'wti-storage';
const DB_VERSION = 1;

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
  if (!dbPromise) {
    dbPromise = initDB();
  }
  return dbPromise;
}

/**
 * IndexedDB storage backend
 */
export const indexedDBStorage: StorageBackend = {
  async get<T>(store: string, key: string): Promise<T | null> {
    const db = await getDB();
    const value = await db.get(store, key);
    return (value as T) ?? null;
  },

  async set<T>(store: string, key: string, value: T): Promise<void> {
    const db = await getDB();
    // Ensure the value has the key field for keyPath
    const valueWithKey = { ...(value as object), id: key };
    await db.put(store, valueWithKey);
  },

  async remove(store: string, key: string): Promise<void> {
    const db = await getDB();
    await db.delete(store, key);
  },

  async clear(store: string): Promise<void> {
    const db = await getDB();
    await db.clear(store);
  },

  async getPage<T>(store: string, options: PageOptions): Promise<T[]> {
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
  },

  async count(store: string): Promise<number> {
    const db = await getDB();
    return db.count(store);
  },

  async getAll<T>(store: string): Promise<T[]> {
    const db = await getDB();
    const values = await db.getAll(store);
    return values as T[];
  },
};

/**
 * Reset database (for testing/debugging)
 */
export async function resetDatabase(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
  await indexedDB.deleteDatabase(DB_NAME);
}
