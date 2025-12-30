/**
 * Storage module
 *
 * Exports the storage backend for use throughout the application
 */

export type { PageOptions, StorageBackend } from './types';
export { indexedDBStorage } from './indexeddb';
export { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from './localStorage';

// Default storage backend
import { indexedDBStorage } from './indexeddb';
export const storage = indexedDBStorage;
