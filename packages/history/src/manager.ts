/**
 * Generic history manager
 *
 * Manages a collection of history entries with persistence, pagination,
 * and automatic pruning. Framework-agnostic - use the subscription pattern
 * to integrate with reactive frameworks like SolidJS, React, or Vue.
 */

import type { StorageBackend } from './storage/types';
import type {
  BaseHistoryEntry,
  HistoryManagerOptions,
  HistoryState,
  StateChangeCallback,
} from './types';

const DEFAULT_MAX_ENTRIES = 500;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_TIMESTAMP_INDEX = 'by-timestamp';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Generic history manager class
 *
 * @typeParam T - Entry type extending BaseHistoryEntry
 *
 * @example
 * ```typescript
 * interface MyEntry extends BaseHistoryEntry {
 *   action: string;
 *   data: unknown;
 * }
 *
 * const manager = new HistoryManager<MyEntry>({
 *   storage: createIndexedDBStorage({ ... }),
 *   storeName: 'my-history',
 * });
 *
 * await manager.init();
 * await manager.add({ action: 'click', data: { x: 100, y: 200 } });
 * ```
 */
export class HistoryManager<T extends BaseHistoryEntry> {
  private storage: StorageBackend;
  private storeName: string;
  private maxEntries: number;
  private pageSize: number;
  private timestampIndex: string;
  private validateEntry?: (entry: unknown) => entry is T;

  private state: HistoryState<T>;
  private subscribers: Set<StateChangeCallback<T>>;

  constructor(options: HistoryManagerOptions<T>) {
    this.storage = options.storage;
    this.storeName = options.storeName;
    this.maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
    this.pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
    this.timestampIndex = options.timestampIndex ?? DEFAULT_TIMESTAMP_INDEX;
    this.validateEntry = options.validateEntry;

    this.state = {
      entries: [],
      totalCount: 0,
      hasMore: true,
      loading: false,
      initialized: false,
    };

    this.subscribers = new Set();
  }

  // ============================================================
  // Subscription API (for reactive wrappers)
  // ============================================================

  /**
   * Subscribe to state changes
   *
   * @param callback - Function called whenever state changes
   * @returns Unsubscribe function
   */
  subscribe(callback: StateChangeCallback<T>): () => void {
    this.subscribers.add(callback);
    // Immediately call with current state
    callback(this.state);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get current state snapshot
   */
  getState(): HistoryState<T> {
    return { ...this.state };
  }

  private notifySubscribers(): void {
    const snapshot = this.getState();
    for (const callback of this.subscribers) {
      callback(snapshot);
    }
  }

  private updateState(update: Partial<HistoryState<T>>): void {
    this.state = { ...this.state, ...update };
    this.notifySubscribers();
  }

  // ============================================================
  // Lifecycle
  // ============================================================

  /**
   * Initialize the manager by loading the first page from storage
   */
  async init(): Promise<void> {
    if (this.state.initialized) {
      return;
    }

    this.updateState({ loading: true });

    try {
      // Get total count
      const count = await this.storage.count(this.storeName);

      // Load first page
      const entries = await this.storage.getPage<T>(this.storeName, {
        limit: this.pageSize,
        index: this.timestampIndex,
        direction: 'prev', // Most recent first
      });

      this.updateState({
        entries,
        totalCount: count,
        hasMore: entries.length >= this.pageSize && entries.length < count,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.warn('Failed to load history from storage:', error);
      this.updateState({
        loading: false,
        initialized: true,
      });
    }
  }

  // ============================================================
  // CRUD Operations
  // ============================================================

  /**
   * Add a new entry to history
   *
   * @param entry - Entry data (id and timestamp are auto-generated)
   * @returns The generated entry ID
   */
  async add(entry: Omit<T, 'id' | 'timestamp'>): Promise<string> {
    const id = generateId();
    const newEntry = {
      ...entry,
      id,
      timestamp: Date.now(),
    } as T;

    // Add to storage
    await this.storage.set(this.storeName, id, newEntry);

    // Add to state (at the beginning since it's newest)
    this.updateState({
      entries: [newEntry, ...this.state.entries],
      totalCount: this.state.totalCount + 1,
    });

    // Prune old entries if over max
    await this.pruneOldEntries();

    return id;
  }

  /**
   * Update an existing entry
   *
   * @param id - Entry ID to update
   * @param update - Partial entry data to merge
   */
  async update(id: string, update: Partial<Omit<T, 'id' | 'timestamp'>>): Promise<void> {
    // Update in state
    const entryIndex = this.state.entries.findIndex((e) => e.id === id);

    if (entryIndex !== -1) {
      const updatedEntry = { ...this.state.entries[entryIndex], ...update };
      const newEntries = [...this.state.entries];
      newEntries[entryIndex] = updatedEntry;
      this.updateState({ entries: newEntries });

      // Update in storage
      await this.storage.set(this.storeName, id, updatedEntry);
    } else {
      // Entry not in state, try to update in storage directly
      const existing = await this.storage.get<T>(this.storeName, id);
      if (existing) {
        const updatedEntry = { ...existing, ...update };
        await this.storage.set(this.storeName, id, updatedEntry);
      }
    }
  }

  /**
   * Remove an entry by ID
   */
  async remove(id: string): Promise<void> {
    // Remove from state
    this.updateState({
      entries: this.state.entries.filter((e) => e.id !== id),
      totalCount: Math.max(0, this.state.totalCount - 1),
    });

    // Remove from storage
    await this.storage.remove(this.storeName, id);
  }

  /**
   * Clear all history
   */
  async clear(): Promise<void> {
    this.updateState({
      entries: [],
      totalCount: 0,
      hasMore: false,
    });
    await this.storage.clear(this.storeName);
  }

  /**
   * Get entry by ID (from loaded entries only)
   */
  get(id: string): T | undefined {
    return this.state.entries.find((entry) => entry.id === id);
  }

  // ============================================================
  // Pagination
  // ============================================================

  /**
   * Load more entries (pagination)
   */
  async loadMore(): Promise<void> {
    if (this.state.loading || !this.state.hasMore) {
      return;
    }

    this.updateState({ loading: true });

    try {
      const currentCount = this.state.entries.length;
      const entries = await this.storage.getPage<T>(this.storeName, {
        limit: this.pageSize,
        offset: currentCount,
        index: this.timestampIndex,
        direction: 'prev',
      });

      if (entries.length > 0) {
        const total = await this.storage.count(this.storeName);
        this.updateState({
          entries: [...this.state.entries, ...entries],
          totalCount: total,
          hasMore: this.state.entries.length + entries.length < total,
          loading: false,
        });
      } else {
        this.updateState({
          hasMore: false,
          loading: false,
        });
      }
    } catch (error) {
      console.warn('Failed to load more history:', error);
      this.updateState({ loading: false });
    }
  }

  // ============================================================
  // Export / Import
  // ============================================================

  /**
   * Export all history as JSON string
   */
  async exportAll(): Promise<string> {
    const allEntries = await this.storage.getAll<T>(this.storeName);
    // Sort by timestamp descending
    allEntries.sort((a, b) => b.timestamp - a.timestamp);
    return JSON.stringify(allEntries, null, 2);
  }

  /**
   * Import history from JSON string
   *
   * @param json - JSON string containing array of entries
   * @returns true if import was successful, false otherwise
   */
  async importFromJson(json: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        return false;
      }

      // Validate entries
      const valid = parsed.every((entry) => {
        // Basic validation for BaseHistoryEntry fields
        const hasBaseFields = typeof entry.id === 'string' && typeof entry.timestamp === 'number';

        // If custom validator is provided, use it
        if (this.validateEntry) {
          return this.validateEntry(entry);
        }

        return hasBaseFields;
      });

      if (!valid) {
        return false;
      }

      // Clear existing and import new
      await this.storage.clear(this.storeName);

      // Import entries (limit to maxEntries)
      const toImport = parsed.slice(0, this.maxEntries);
      for (const entry of toImport) {
        await this.storage.set(this.storeName, entry.id, entry);
      }

      // Reset state and reload
      this.state = {
        entries: [],
        totalCount: 0,
        hasMore: true,
        loading: false,
        initialized: false,
      };
      await this.init();

      return true;
    } catch {
      return false;
    }
  }

  // ============================================================
  // Private Helpers
  // ============================================================

  /**
   * Remove oldest entries if over maxEntries limit
   */
  private async pruneOldEntries(): Promise<void> {
    const total = await this.storage.count(this.storeName);

    if (total > this.maxEntries) {
      // Get oldest entries to remove
      const oldest = await this.storage.getPage<T>(this.storeName, {
        limit: total - this.maxEntries,
        index: this.timestampIndex,
        direction: 'next', // Oldest first
      });

      for (const old of oldest) {
        await this.storage.remove(this.storeName, old.id);
      }

      this.updateState({ totalCount: this.maxEntries });
    }
  }
}
