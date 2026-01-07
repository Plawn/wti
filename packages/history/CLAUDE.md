# CLAUDE.md - @wti/history

Instructions for AI assistants implementing @wti/history in a project.

## What is this package?

`@wti/history` is a generic, framework-agnostic history management library with:
- Persistent storage (IndexedDB by default)
- Pagination support
- Automatic pruning of old entries
- Subscription pattern for reactive frameworks
- Export/Import functionality

## When to use this package

Use `@wti/history` when you need to:
- Store a list of user actions with persistence
- Implement request/response history
- Create undo/redo functionality
- Track events with automatic cleanup
- Build any feature that needs paginated, persistent history

## Implementation Checklist

When implementing `@wti/history` in a project, follow these steps:

### Step 1: Install the package

```bash
npm install @wti/history
# or
bun add @wti/history
```

### Step 2: Define your entry type

Always extend `BaseHistoryEntry`:

```typescript
import type { BaseHistoryEntry } from '@wti/history';

// REQUIRED: Extend BaseHistoryEntry
interface MyEntry extends BaseHistoryEntry {
  // Add your custom fields here
  action: string;
  data: unknown;
}
```

**Important**: `id` and `timestamp` are auto-generated. Do NOT include them in your type definition.

### Step 3: Create storage backend

```typescript
import { createIndexedDBStorage } from '@wti/history';

const storage = createIndexedDBStorage({
  dbName: 'your-app-name',  // Choose a unique name for your app
  dbVersion: 1,
  stores: {
    history: {
      keyPath: 'id',
      indexes: [
        { name: 'by-timestamp', keyPath: 'timestamp' }, // REQUIRED for pagination
      ],
    },
  },
});
```

**Critical**: The `by-timestamp` index is required for proper pagination ordering.

### Step 4: Create the manager

```typescript
import { HistoryManager } from '@wti/history';

const manager = new HistoryManager<MyEntry>({
  storage,
  storeName: 'history',  // Must match the store name in storage config
  maxEntries: 500,       // Optional: default is 500
  pageSize: 20,          // Optional: default is 20
});
```

### Step 5: Initialize before use

```typescript
// ALWAYS call init() before using the manager
await manager.init();
```

### Step 6: Integrate with your framework

See framework-specific examples in README.md.

## Common Mistakes to Avoid

### ❌ Forgetting to call init()

```typescript
// WRONG - using manager before init
const manager = new HistoryManager({ ... });
await manager.add({ action: 'test' }); // May fail or behave unexpectedly

// CORRECT
const manager = new HistoryManager({ ... });
await manager.init();
await manager.add({ action: 'test' });
```

### ❌ Including id/timestamp in add()

```typescript
// WRONG - id and timestamp are auto-generated
await manager.add({
  id: 'my-id',           // DON'T include this
  timestamp: Date.now(), // DON'T include this
  action: 'test',
});

// CORRECT
await manager.add({
  action: 'test',
});
```

### ❌ Missing timestamp index

```typescript
// WRONG - pagination won't work correctly
const storage = createIndexedDBStorage({
  dbName: 'app',
  dbVersion: 1,
  stores: {
    history: { keyPath: 'id' }, // Missing indexes!
  },
});

// CORRECT
const storage = createIndexedDBStorage({
  dbName: 'app',
  dbVersion: 1,
  stores: {
    history: {
      keyPath: 'id',
      indexes: [{ name: 'by-timestamp', keyPath: 'timestamp' }],
    },
  },
});
```

### ❌ Not cleaning up subscriptions

```typescript
// WRONG - memory leak in React/Vue/Svelte
useEffect(() => {
  manager.subscribe((state) => { ... });
}, []);

// CORRECT
useEffect(() => {
  const unsubscribe = manager.subscribe((state) => { ... });
  return unsubscribe; // Cleanup on unmount
}, []);
```

## Framework Integration Patterns

### Pattern: Create a store/hook factory

For most frameworks, create a factory function that:
1. Creates the storage and manager
2. Sets up reactive state
3. Subscribes to manager updates
4. Returns actions and state

```typescript
export function createMyHistoryStore() {
  // 1. Setup
  const storage = createIndexedDBStorage({ ... });
  const manager = new HistoryManager<MyEntry>({ storage, storeName: 'history' });

  // 2. Framework-specific reactive state
  const state = createReactiveState();

  // 3. Subscribe
  const unsubscribe = manager.subscribe((s) => updateReactiveState(s));

  // 4. Return interface
  return {
    state,
    init: () => manager.init(),
    add: (entry) => manager.add(entry),
    remove: (id) => manager.remove(id),
    clear: () => manager.clear(),
    loadMore: () => manager.loadMore(),
    exportHistory: () => manager.exportAll(),
    importHistory: (json) => manager.importFromJson(json),
  };
}
```

### Pattern: Singleton manager for app-wide history

```typescript
// history.ts
let manager: HistoryManager<MyEntry> | null = null;

export function getHistoryManager() {
  if (!manager) {
    const storage = createIndexedDBStorage({ ... });
    manager = new HistoryManager<MyEntry>({ storage, storeName: 'history' });
  }
  return manager;
}

// Usage in components
const manager = getHistoryManager();
await manager.init();
```

## Storage Configuration Reference

### IndexedDB Config

```typescript
interface IndexedDBConfig {
  dbName: string;     // Database name (unique per app)
  dbVersion: number;  // Increment when changing schema
  stores: Record<string, {
    keyPath: string;  // Usually 'id'
    indexes?: Array<{
      name: string;      // Index name
      keyPath: string;   // Field to index
      options?: IDBIndexParameters; // { unique?: boolean, multiEntry?: boolean }
    }>;
  }>;
}
```

### Multiple stores in one database

```typescript
const storage = createIndexedDBStorage({
  dbName: 'my-app',
  dbVersion: 1,
  stores: {
    history: {
      keyPath: 'id',
      indexes: [{ name: 'by-timestamp', keyPath: 'timestamp' }],
    },
    settings: {
      keyPath: 'key',
    },
    cache: {
      keyPath: 'id',
      indexes: [{ name: 'by-expiry', keyPath: 'expiresAt' }],
    },
  },
});

// Use same storage for different managers
const historyManager = new HistoryManager({ storage, storeName: 'history' });
const cacheManager = new HistoryManager({ storage, storeName: 'cache' });
```

## Testing

Use `createMemoryStorage()` for unit tests:

```typescript
import { HistoryManager, createMemoryStorage } from '@wti/history';

describe('MyFeature', () => {
  let manager: HistoryManager<MyEntry>;

  beforeEach(() => {
    const storage = createMemoryStorage(); // In-memory, no IndexedDB
    manager = new HistoryManager({ storage, storeName: 'test' });
  });

  it('should add entries', async () => {
    await manager.init();
    const id = await manager.add({ action: 'test' });
    expect(manager.get(id)).toBeDefined();
  });
});
```

## Type Safety

### Validator for import

```typescript
function isMyEntry(entry: unknown): entry is MyEntry {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.timestamp === 'number' &&
    typeof e.action === 'string'
  );
}

const manager = new HistoryManager<MyEntry>({
  storage,
  storeName: 'history',
  validateEntry: isMyEntry, // Used by importFromJson()
});
```

## API Quick Reference

```typescript
// Lifecycle
await manager.init()

// CRUD
await manager.add(entry)     // Returns: string (id)
await manager.update(id, partial)
await manager.remove(id)
await manager.clear()
manager.get(id)              // Returns: T | undefined

// Pagination
await manager.loadMore()
manager.getState()           // Returns: HistoryState<T>

// Export/Import
await manager.exportAll()    // Returns: string (JSON)
await manager.importFromJson(json) // Returns: boolean

// Subscription
const unsubscribe = manager.subscribe(callback)
unsubscribe()
```

## Exports Summary

```typescript
// Main exports
import {
  HistoryManager,
  createIndexedDBStorage,
  createMemoryStorage,
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from '@wti/history';

// Type exports
import type {
  BaseHistoryEntry,
  HistoryManagerOptions,
  HistoryState,
  StateChangeCallback,
  StorageBackend,
  PageOptions,
  IndexedDBConfig,
  StoreConfig,
  IndexConfig,
} from '@wti/history';

// Subpath export for storage only
import { createIndexedDBStorage } from '@wti/history/storage';
```
