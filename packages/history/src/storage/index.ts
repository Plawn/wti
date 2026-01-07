/**
 * Storage module exports
 */

export type {
  StorageBackend,
  PageOptions,
  IndexedDBConfig,
  StoreConfig,
  IndexConfig,
} from './types';

export { createIndexedDBStorage } from './indexeddb';
export { createMemoryStorage } from './memory';
export {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from './localStorage';
