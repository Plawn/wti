/**
 * Storage module
 *
 * Re-exports storage utilities from @wti/history for backwards compatibility.
 * The main storage backend (wtiStorage) is defined in stores/history.ts.
 */

export type { PageOptions, StorageBackend } from '@wti/history';
export {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from '@wti/history';
