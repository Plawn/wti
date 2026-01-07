/**
 * Storage backend abstraction
 *
 * Provides a unified interface for persistent storage,
 * allowing different implementations (IndexedDB, localStorage, memory, etc.)
 */

export interface PageOptions {
  /** Number of items to fetch */
  limit: number;
  /** Number of items to skip (for offset-based pagination) */
  offset?: number;
  /** Index name to use for ordering */
  index?: string;
  /** Sort direction: 'prev' for descending, 'next' for ascending */
  direction?: 'prev' | 'next';
}

export interface StorageBackend {
  /**
   * Get a value by key from a store
   */
  get<T>(store: string, key: string): Promise<T | null>;

  /**
   * Set a value by key in a store
   */
  set<T>(store: string, key: string, value: T): Promise<void>;

  /**
   * Remove a value by key from a store
   */
  remove(store: string, key: string): Promise<void>;

  /**
   * Clear all values from a store
   */
  clear(store: string): Promise<void>;

  /**
   * Get a page of items from a store (for paginated queries)
   */
  getPage<T>(store: string, options: PageOptions): Promise<T[]>;

  /**
   * Get total count of items in a store
   */
  count(store: string): Promise<number>;

  /**
   * Get all items from a store
   */
  getAll<T>(store: string): Promise<T[]>;
}

/**
 * Index configuration for object stores
 */
export interface IndexConfig {
  /** Index name */
  name: string;
  /** Key path to index */
  keyPath: string;
  /** Index options */
  options?: IDBIndexParameters;
}

/**
 * Store configuration for IndexedDB
 */
export interface StoreConfig {
  /** Key path for the store (usually 'id') */
  keyPath: string;
  /** Indexes to create on the store */
  indexes?: IndexConfig[];
}

/**
 * Configuration for IndexedDB storage
 */
export interface IndexedDBConfig {
  /** Database name */
  dbName: string;
  /** Database version */
  dbVersion: number;
  /** Stores configuration: name -> config */
  stores: Record<string, StoreConfig>;
}
