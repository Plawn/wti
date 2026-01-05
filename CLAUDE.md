# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WTI (What The Interface) is a modern Swagger UI alternative that supports both OpenAPI and gRPC APIs. Built as a monorepo using Bun workspaces with SolidJS for the UI layer.

## Commands
```bash
# Development
bun run dev                        # Start demo app dev server
bun run --filter @wti/ui dev       # Dev UI package only
bun run --filter @wti/core dev     # Watch mode for core package

# Build
bun run build                      # Build all packages
bun run build:demo                 # Build demo app only
bun run --filter @wti/core build   # Build specific package

# Testing
bun test                           # Run all tests
bun test packages/core             # Run tests for specific package

# Linting & Type Checking
bun run lint                       # Check with Biome
bun run lint:fix                   # Auto-fix lint issues
bun run typecheck                  # TypeScript check all packages
```

## Architecture

### Monorepo Structure

- `packages/core` (@wti/core) - Framework-agnostic core logic: OpenAPI parsing, HTTP client, type definitions
- `packages/ui` (@wti/ui) - SolidJS UI components with Tailwind CSS v4
- `packages/web-component` (@wti/element) - Web Component wrapper using solid-element for framework-agnostic usage
- `apps/demo` (@wti/demo) - Demo application

### Key Architectural Decisions

**Unified Type System** (`packages/core/src/types/api.ts`): OpenAPI specs are normalized to a unified `ApiSpec` type. This allows UI components to work with the API spec without protocol-specific logic.

**Styling** (`packages/ui/src/styles/global.css`): Uses Tailwind CSS v4 with custom iOS 26-inspired glassmorphism utilities (`.glass`, `.glass-card`, `.glass-input`, etc.). Use these utility classes rather than custom CSS.

**i18n** (`packages/ui/src/i18n/`): Type-safe translations with `Translations` interface. Supports `en` and `fr` locales. Use `useI18n()` hook which returns `{ t, locale }`.

**State Management** (`packages/ui/src/stores/spec.ts`): Uses SolidJS stores (`createStore`). The `createSpecStore()` factory manages API spec state, selected operation, server selection, search, and tag expansion.

### Package Dependencies
```
@wti/demo -> @wti/ui -> @wti/core
@wti/element -> @wti/ui -> @wti/core
```

### File Organization

**Components:**
- Single file for simple components: `ComponentName.tsx`
- Folder with `index.ts` for complex components with sub-components:
  ```
  components/History/
  ├── index.ts              → exports public components
  ├── HistoryDrawer.tsx     → main component
  └── HistoryEntry.tsx      → sub-component (if needed)
  ```
- Extract to `components/shared/` when used by 3+ components

**When to create new files:**
- New feature → new component file or folder
- Shared logic → new hook in `hooks/` or utility in `utils/`
- New data domain → new store in `stores/`

### Stores

Three stores exist — check if your state belongs in one before creating new:
- `specStore` — API spec, selected operation, servers, search
- `authStore` — Authentication configs, tokens, OIDC flow
- `historyStore` — Request history, replay

**Store pattern:**
```typescript
export function createXxxStore() {
  const [state, setState] = createStore<XxxState>(initialState);
  const [loading, setLoading] = createSignal(false);

  const actions = {
    async doThing() { /* ... */ },
  };

  return { state, actions, loading };
}
export type XxxStore = ReturnType<typeof createXxxStore>;
```

**Persistence:** Use `storage` utility from `src/storage/` for IndexedDB persistence. See `authStore` for example.

### Hooks

Existing hooks in `packages/ui/src/hooks/`:
- `useDialogState` — Escape key, backdrop click, body scroll lock
- `useIsDark` — Dark mode detection for Portals
- `useAuthConfig` — Get typed auth config from store

Check these before implementing similar logic.

### Error Handling

- Use `authStore.error` signal pattern for transient errors (auto-clear after timeout)
- Use `store.state.error` for persistent errors that need user action
- Display errors with `ErrorToast` (transient) or `ErrorScreen` (blocking)
- Always provide user-facing messages via i18n, not raw error strings

### Accessibility

- Keyboard navigation: Arrow keys + Enter for lists, Escape to close
- Use semantic HTML (`<button>`, `<nav>`) over `role="button"` on divs
- Add `aria-label` for icon-only buttons
- Test with keyboard-only navigation

## Code Conventions

### Component Pattern (SolidJS)
```typescript
import { Component } from 'solid-js';

interface ComponentProps {
  value: string;
}

export const Component: Component<ComponentProps> = (props) => {
  return <div class="glass-card p-4">{props.value}</div>;
};
```

### Styling (Tailwind CSS v4)
Use Tailwind utility classes combined with custom glass utilities from `global.css`:
- Glass effects: `glass`, `glass-card`, `glass-thick`, `glass-thin`, `glass-sidebar`
- Inputs: `glass-input`
- Buttons: `btn-primary`, `btn-secondary`, `btn-tertiary`, `glass-button`
- Active states: `glass-active`
- Background: `bg-mesh`

For hover states, transitions, selections — search existing components and copy their exact patterns.

### UI Consistency Rules

**Before implementing any UI behavior or visual pattern:**
1. Search the codebase for similar existing implementations
2. Copy the exact same approach (classes, signals, structure)
3. If no match exists, check `components/shared/` for reusable components

**Never invent new patterns** — the codebase already has established conventions for hover states, selections, keyboard navigation, transitions, etc. Find them and reuse them exactly.

### Naming
- Components: PascalCase (`OperationTree.tsx`)
- Stores: camelCase (`spec.ts`)
- Types/interfaces: PascalCase

### Code Style (Biome)
- Single quotes for strings
- Semicolons required
- 2-space indentation
- 100 character line width

---

## ⚠️ Critical Rules for Claude Code

### Before ANY Modification

1. **Read first, code second**: Always read the entire file and its imports before modifying
2. **Check for existing utils**: Search `packages/core/src/` and `packages/ui/src/` for existing functions before creating new ones
3. **Run tests after each change**: `bun test` must pass before moving to next task
4. **One change at a time**: Do not batch multiple unrelated changes

### Existing Utilities — DO NOT REWRITE
```
packages/core/src/
├── openapi/parser.ts       → parseOpenApi(), parseOpenApiFromString()
├── openapi/converter.ts    → convertOpenApiToSpec()
├── http/client.ts          → executeRequest()
├── http/builder.ts         → buildRequestConfig()
├── types/api.ts            → All API types (ApiSpec, Operation, Parameter, etc.)
├── types/request.ts        → RequestConfig, ResponseData types
└── types/auth.ts           → Authentication types

packages/ui/src/
├── stores/spec.ts          → createSpecStore() - all spec state management
├── i18n/                   → useI18n() hook returns { t, locale }
├── styles/global.css       → Glass utilities, button styles (use these classes)
└── components/shared/      → Reusable UI components
```

### Dependencies to Use

| Need | Use | NOT |
|------|-----|-----|
| HTTP requests | `packages/core/src/http/client.ts` | raw fetch |
| State | SolidJS `createStore`, `createSignal` | external state libs |
| Styling | Tailwind classes + glass utilities from `global.css` | inline styles, custom CSS files |
| Icons | existing icon components | new icon libraries |
| Translations | `useI18n()` hook | hardcoded strings |

### Prefer Well-Known Libraries

Before implementing any non-trivial logic, search for established npm packages. Prefer battle-tested libraries over custom implementations.

| Task | Preferred Library |
|------|-------------------|
| JSON Schema validation | `ajv` |
| Date/time formatting | `date-fns` |
| Deep object merge | `deepmerge` |
| URL manipulation | native `URL` API |
| Markdown rendering | `marked`, `markdown-it` |
| Code syntax highlighting | `prism-js`, `highlight.js` |
| Copy to clipboard | `clipboard-copy` |
| HTTP mocking (tests) | `msw` |

**Rule**: If a problem has a well-known solution with >1M weekly downloads, use it. Don't reinvent wheels.

### Anti-Patterns — DO NOT

- ❌ Reimplement logic that exists in popular npm packages
- ❌ Create new utility functions without checking existing ones
- ❌ Hardcode colors/spacing — use Tailwind classes and glass utilities
- ❌ Add UI strings without i18n (`t('key')`)
- ❌ Modify `packages/core/src/types/api.ts` without explicit approval
- ❌ Use React patterns (useState, useEffect) — this is SolidJS
- ❌ Create custom `.css` files — use Tailwind classes
- ❌ Import from `@wti/ui` in `@wti/core` (breaks dependency direction)
- ❌ Invent new UI patterns — always search for and copy existing implementations first

### Testing Rules

- Write tests only for: parsing logic, HTTP client, complex transformations
- No tests for: simple components, getters, type definitions
- Test file location: same directory as source, named `*.test.ts`

### When Fixing Bugs
```
1. Identify the root cause (don't just patch symptoms)
2. Check what other code depends on the function you're changing
3. Run `bun test` before AND after the fix
4. If fix breaks something else → stop and reassess approach
```

### Git Commits

- **Never mention Claude, AI, or "Generated by" in commit messages**
- Write commit messages as if written by a human developer
- Use conventional commits format: `feat:`, `fix:`, `refactor:`, `docs:`, etc.

### SolidJS-Specific Reminders

- Props are accessed via `props.x`, not destructured (breaks reactivity)
- Use `<Show>` and `<For>` components, not ternaries/map for conditional rendering
- `createEffect` ≠ `useEffect` — different mental model
- Signals are functions: `count()` to read, `setCount(x)` to write
- **Portal dark mode pitfall**: `<Portal>` renders content at document root, outside the `.dark` class container. This breaks `dark:` Tailwind variants. Fix: detect dark mode and add the class manually:
  ```typescript
  const isDark = () =>
    document.documentElement.classList.contains('dark') || document.querySelector('.dark') !== null;

  // In Portal content:
  <div class={`... ${isDark() ? 'dark' : ''}`}>
  ```
  See `Drawer.tsx` and `CommandPalette.tsx` for examples.

### Performance

- Use `createMemo` for expensive derived computations
- Avoid creating functions inside JSX — define them outside the return
- Use `batch()` when updating multiple signals together
- Lazy load heavy components with dynamic `import()`
- Keep stores flat — deeply nested state causes unnecessary re-renders