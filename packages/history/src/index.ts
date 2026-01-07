/**
 * @wti/history - Generic history management with storage abstraction
 *
 * @example
 * ```typescript
 * import { HistoryManager, createIndexedDBStorage } from '@wti/history';
 * import type { BaseHistoryEntry } from '@wti/history';
 *
 * // Define your entry type
 * interface MyEntry extends BaseHistoryEntry {
 *   action: string;
 *   data: unknown;
 * }
 *
 * // Create storage backend
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
 *
 * // Create history manager
 * const manager = new HistoryManager<MyEntry>({
 *   storage,
 *   storeName: 'history',
 * });
 *
 * // Initialize and use
 * await manager.init();
 * await manager.add({ action: 'click', data: { x: 100 } });
 * ```
 */

// Core types
export type {
  BaseHistoryEntry,
  HistoryManagerOptions,
  HistoryState,
  StateChangeCallback,
} from './types';

// Manager class
export { HistoryManager } from './manager';

// Storage (re-export from storage module)
export type {
  StorageBackend,
  PageOptions,
  IndexedDBConfig,
  StoreConfig,
  IndexConfig,
} from './storage/types';

export { createIndexedDBStorage } from './storage/indexeddb';
export { createMemoryStorage } from './storage/memory';
export {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from './storage/localStorage';
