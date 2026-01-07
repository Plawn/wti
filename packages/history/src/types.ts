/**
 * Core types for generic history management
 */

import type { StorageBackend } from './storage/types';

/**
 * Base history entry type with required fields.
 * Extend this interface with your domain-specific fields.
 */
export interface BaseHistoryEntry {
  /** Unique identifier for the entry */
  id: string;
  /** Timestamp when the entry was created (ms since epoch) */
  timestamp: number;
}

/**
 * Configuration options for HistoryManager
 */
export interface HistoryManagerOptions<T extends BaseHistoryEntry> {
  /** Storage backend to use */
  storage: StorageBackend;
  /** Storage store/collection name */
  storeName: string;
  /** Maximum number of entries to keep (default: 500) */
  maxEntries?: number;
  /** Number of entries per page (default: 20) */
  pageSize?: number;
  /** Index name for timestamp-based ordering (default: 'by-timestamp') */
  timestampIndex?: string;
  /** Optional validator for entries during import */
  validateEntry?: (entry: unknown) => entry is T;
}

/**
 * State snapshot for reactive wrappers
 */
export interface HistoryState<T extends BaseHistoryEntry> {
  entries: T[];
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  initialized: boolean;
}

/**
 * Callback type for state changes
 */
export type StateChangeCallback<T extends BaseHistoryEntry> = (state: HistoryState<T>) => void;
