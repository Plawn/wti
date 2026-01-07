# @wti/history

Generic history management with storage abstraction. Framework-agnostic, works with any JavaScript/TypeScript project.

## Installation

```bash
npm install @wti/history
# or
bun add @wti/history
```

## Quick Start

```typescript
import { HistoryManager, createIndexedDBStorage } from '@wti/history';
import type { BaseHistoryEntry } from '@wti/history';

// 1. Define your entry type
interface MyEntry extends BaseHistoryEntry {
  action: string;
  payload: unknown;
}

// 2. Create storage backend
const storage = createIndexedDBStorage({
  dbName: 'my-app',
  dbVersion: 1,
  stores: {
    history: {
      keyPath: 'id',
      indexes: [{ name: 'by-timestamp', keyPath: 'timestamp' }],
    },
  },
});

// 3. Create manager
const manager = new HistoryManager<MyEntry>({
  storage,
  storeName: 'history',
});

// 4. Initialize and use
await manager.init();
await manager.add({ action: 'user_login', payload: { userId: '123' } });
```

## API Reference

### Types

#### `BaseHistoryEntry`

Base type that all history entries must extend:

```typescript
interface BaseHistoryEntry {
  id: string;        // Auto-generated unique ID
  timestamp: number; // Auto-generated Unix timestamp (ms)
}
```

#### `HistoryManagerOptions<T>`

Configuration options for `HistoryManager`:

```typescript
interface HistoryManagerOptions<T extends BaseHistoryEntry> {
  storage: StorageBackend;      // Storage backend (IndexedDB, memory, etc.)
  storeName: string;            // Name of the store/collection
  maxEntries?: number;          // Max entries to keep (default: 500)
  pageSize?: number;            // Entries per page (default: 20)
  timestampIndex?: string;      // Index name for sorting (default: 'by-timestamp')
  validateEntry?: (entry: unknown) => entry is T; // Optional validator for imports
}
```

#### `HistoryState<T>`

State snapshot returned by `getState()` and passed to subscribers:

```typescript
interface HistoryState<T extends BaseHistoryEntry> {
  entries: T[];       // Currently loaded entries
  totalCount: number; // Total entries in storage
  hasMore: boolean;   // More entries available to load
  loading: boolean;   // Currently loading
  initialized: boolean; // Has been initialized
}
```

### HistoryManager<T>

#### Constructor

```typescript
const manager = new HistoryManager<MyEntry>(options);
```

#### Lifecycle

```typescript
// Initialize (load first page from storage)
await manager.init();
```

#### CRUD Operations

```typescript
// Add entry (id and timestamp are auto-generated)
const id = await manager.add({ action: 'click', payload: { x: 100 } });

// Update entry
await manager.update(id, { payload: { x: 200 } });

// Remove entry
await manager.remove(id);

// Clear all entries
await manager.clear();

// Get entry by ID (from loaded entries only)
const entry = manager.get(id);
```

#### Pagination

```typescript
// Load more entries
await manager.loadMore();

// Check state
const state = manager.getState();
console.log(state.hasMore);    // true if more pages available
console.log(state.totalCount); // total entries in storage
```

#### Export/Import

```typescript
// Export all entries as JSON string
const json = await manager.exportAll();

// Import from JSON string
const success = await manager.importFromJson(json);
```

#### Subscription (for reactive frameworks)

```typescript
// Subscribe to state changes
const unsubscribe = manager.subscribe((state) => {
  console.log('Entries:', state.entries);
  console.log('Loading:', state.loading);
});

// Unsubscribe when done
unsubscribe();
```

### Storage Backends

#### IndexedDB (Browser)

```typescript
import { createIndexedDBStorage } from '@wti/history';

const storage = createIndexedDBStorage({
  dbName: 'my-app',
  dbVersion: 1,
  stores: {
    history: {
      keyPath: 'id',
      indexes: [
        { name: 'by-timestamp', keyPath: 'timestamp' },
        { name: 'by-action', keyPath: 'action' }, // Custom index
      ],
    },
    // Can define multiple stores
    settings: {
      keyPath: 'key',
    },
  },
});
```

#### Memory (Testing/SSR)

```typescript
import { createMemoryStorage } from '@wti/history';

const storage = createMemoryStorage();
```

#### Custom Backend

Implement the `StorageBackend` interface:

```typescript
import type { StorageBackend, PageOptions } from '@wti/history';

const customStorage: StorageBackend = {
  async get<T>(store: string, key: string): Promise<T | null> { /* ... */ },
  async set<T>(store: string, key: string, value: T): Promise<void> { /* ... */ },
  async remove(store: string, key: string): Promise<void> { /* ... */ },
  async clear(store: string): Promise<void> { /* ... */ },
  async getPage<T>(store: string, options: PageOptions): Promise<T[]> { /* ... */ },
  async count(store: string): Promise<number> { /* ... */ },
  async getAll<T>(store: string): Promise<T[]> { /* ... */ },
};
```

## Framework Integration Examples

### SolidJS

```typescript
import { createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';
import { HistoryManager, createIndexedDBStorage } from '@wti/history';

interface MyEntry extends BaseHistoryEntry {
  action: string;
}

export function createHistoryStore() {
  const storage = createIndexedDBStorage({ /* config */ });
  const manager = new HistoryManager<MyEntry>({ storage, storeName: 'history' });

  const [state, setState] = createStore({ entries: [] as MyEntry[] });
  const [loading, setLoading] = createSignal(false);

  const unsubscribe = manager.subscribe((s) => {
    setState('entries', s.entries);
    setLoading(s.loading);
  });

  onCleanup(unsubscribe);

  return {
    state,
    loading,
    init: () => manager.init(),
    add: (entry: Omit<MyEntry, 'id' | 'timestamp'>) => manager.add(entry),
    remove: (id: string) => manager.remove(id),
  };
}
```

### React

```typescript
import { useState, useEffect, useCallback } from 'react';
import { HistoryManager, createIndexedDBStorage, type HistoryState } from '@wti/history';

interface MyEntry extends BaseHistoryEntry {
  action: string;
}

const storage = createIndexedDBStorage({ /* config */ });
const manager = new HistoryManager<MyEntry>({ storage, storeName: 'history' });

export function useHistory() {
  const [state, setState] = useState<HistoryState<MyEntry>>(() => manager.getState());

  useEffect(() => {
    const unsubscribe = manager.subscribe(setState);
    manager.init();
    return unsubscribe;
  }, []);

  const add = useCallback(
    (entry: Omit<MyEntry, 'id' | 'timestamp'>) => manager.add(entry),
    []
  );

  return { ...state, add };
}
```

### Vue 3

```typescript
import { ref, onMounted, onUnmounted } from 'vue';
import { HistoryManager, createIndexedDBStorage } from '@wti/history';

interface MyEntry extends BaseHistoryEntry {
  action: string;
}

export function useHistory() {
  const storage = createIndexedDBStorage({ /* config */ });
  const manager = new HistoryManager<MyEntry>({ storage, storeName: 'history' });

  const entries = ref<MyEntry[]>([]);
  const loading = ref(false);

  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    unsubscribe = manager.subscribe((state) => {
      entries.value = state.entries;
      loading.value = state.loading;
    });
    manager.init();
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  return {
    entries,
    loading,
    add: (entry: Omit<MyEntry, 'id' | 'timestamp'>) => manager.add(entry),
  };
}
```

### Svelte

```typescript
import { writable } from 'svelte/store';
import { HistoryManager, createIndexedDBStorage } from '@wti/history';

interface MyEntry extends BaseHistoryEntry {
  action: string;
}

export function createHistoryStore() {
  const storage = createIndexedDBStorage({ /* config */ });
  const manager = new HistoryManager<MyEntry>({ storage, storeName: 'history' });

  const { subscribe, set } = writable<MyEntry[]>([]);

  manager.subscribe((state) => set(state.entries));
  manager.init();

  return {
    subscribe,
    add: (entry: Omit<MyEntry, 'id' | 'timestamp'>) => manager.add(entry),
    remove: (id: string) => manager.remove(id),
  };
}
```

### Vanilla JavaScript

```typescript
import { HistoryManager, createIndexedDBStorage } from '@wti/history';

const storage = createIndexedDBStorage({
  dbName: 'my-app',
  dbVersion: 1,
  stores: {
    history: { keyPath: 'id', indexes: [{ name: 'by-timestamp', keyPath: 'timestamp' }] },
  },
});

const manager = new HistoryManager({
  storage,
  storeName: 'history',
});

// Subscribe to render UI
manager.subscribe((state) => {
  const list = document.getElementById('history-list');
  list.innerHTML = state.entries
    .map((e) => `<li>${e.action} - ${new Date(e.timestamp).toLocaleString()}</li>`)
    .join('');
});

// Initialize
await manager.init();

// Add entries
document.getElementById('add-btn').addEventListener('click', () => {
  manager.add({ action: 'button_click' });
});
```

## Common Patterns

### Request/Response History

```typescript
interface RequestEntry extends BaseHistoryEntry {
  url: string;
  method: string;
  requestBody?: unknown;
  responseStatus?: number;
  responseBody?: unknown;
  duration?: number;
  error?: string;
}

const manager = new HistoryManager<RequestEntry>({
  storage,
  storeName: 'requests',
  maxEntries: 100,
});

// Log a request
async function logRequest(url: string, method: string, body?: unknown) {
  const id = await manager.add({ url, method, requestBody: body });

  const start = Date.now();
  try {
    const response = await fetch(url, { method, body: JSON.stringify(body) });
    const data = await response.json();
    await manager.update(id, {
      responseStatus: response.status,
      responseBody: data,
      duration: Date.now() - start,
    });
  } catch (err) {
    await manager.update(id, {
      error: err.message,
      duration: Date.now() - start,
    });
  }
}
```

### Undo/Redo Stack

```typescript
interface ActionEntry extends BaseHistoryEntry {
  type: string;
  payload: unknown;
  inverse: unknown; // Data needed to undo
}

const manager = new HistoryManager<ActionEntry>({
  storage,
  storeName: 'actions',
  maxEntries: 50,
});

async function doAction(type: string, payload: unknown, inverse: unknown) {
  await manager.add({ type, payload, inverse });
  applyAction(type, payload);
}

async function undo() {
  const state = manager.getState();
  const lastAction = state.entries[0];
  if (lastAction) {
    applyAction(lastAction.type, lastAction.inverse);
    await manager.remove(lastAction.id);
  }
}
```

### With Validation for Import

```typescript
interface MyEntry extends BaseHistoryEntry {
  action: string;
  userId: string;
}

function isValidEntry(entry: unknown): entry is MyEntry {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.timestamp === 'number' &&
    typeof e.action === 'string' &&
    typeof e.userId === 'string'
  );
}

const manager = new HistoryManager<MyEntry>({
  storage,
  storeName: 'history',
  validateEntry: isValidEntry, // Used during importFromJson
});
```

## localStorage Utilities

The package also exports localStorage helpers:

```typescript
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from '@wti/history';

// Safe get with default value (SSR-compatible)
const theme = getLocalStorageItem('theme', 'light');

// Safe set (returns false on quota exceeded)
setLocalStorageItem('theme', 'dark');

// Safe remove
removeLocalStorageItem('theme');
```

## License

Apache-2.0
