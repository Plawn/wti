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

- `packages/core` (@wti/core) - Framework-agnostic core logic: OpenAPI/gRPC parsing, HTTP client, type definitions, code generation
- `packages/ui` (@wti/ui) - SolidJS UI components with Vanilla Extract CSS
- `packages/web-component` (@wti/element) - Web Component wrapper using solid-element for framework-agnostic usage
- `apps/demo` (@wti/demo) - Demo application

### Key Architectural Decisions

**Unified Type System** (`packages/core/src/types/api.ts`): Both OpenAPI and gRPC specs are normalized to a unified `ApiSpec` type. This allows UI components to work with either protocol without conditional logic.

**Theming** (`packages/ui/src/themes/`): Uses Vanilla Extract's `createThemeContract` for type-safe CSS variables. Theme files (`light.css.ts`, `dark.css.ts`) implement the contract defined in `contract.css.ts`.

**i18n** (`packages/ui/src/i18n/`): Type-safe translations with `Translations` interface. Supports `en` and `fr` locales. Uses SolidJS context for locale management.

**State Management** (`packages/ui/src/stores/`): Uses SolidJS stores (`createStore`). The `specStore` manages API spec state, selected operation, search, and tag expansion.

### Package Dependencies
```
@wti/demo -> @wti/ui -> @wti/core
@wti/element -> @wti/ui -> @wti/core
```

## Code Conventions

### Component Pattern (SolidJS)
```typescript
import { Component } from 'solid-js';
import * as styles from './Component.css';

interface ComponentProps {
  value: string;
}

export const Component: Component<ComponentProps> = (props) => {
  return <div class={styles.root}>{props.value}</div>;
};
```

### Styling (Vanilla Extract)
```typescript
// Component.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../themes/contract.css';

export const root = style({
  padding: vars.spacing[4],
  backgroundColor: vars.colors.bg,
});
```

### Naming
- Components: PascalCase (`OperationTree.tsx`)
- CSS files: `Component.css.ts`
- Stores: camelCase (`specStore.ts`)
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
├── parsers/openapi.ts      → parseOpenApiSpec()
├── parsers/grpc.ts         → parseGrpcSpec()
├── http/client.ts          → executeRequest(), buildRequestConfig()
├── types/api.ts            → All API types (ApiSpec, Operation, Parameter, etc.)
└── utils/                  → Check here before creating any helper

packages/ui/src/
├── stores/specStore.ts     → All spec state management
├── i18n/                   → useTranslation(), t()
├── themes/contract.css.ts  → vars (use this, never hardcode colors/spacing)
└── components/shared/      → Reusable UI components
```

### Dependencies to Use

| Need | Use | NOT |
|------|-----|-----|
| HTTP requests | `packages/core/src/http/client.ts` | raw fetch |
| State | SolidJS `createStore`, `createSignal` | external state libs |
| Styling | Vanilla Extract + `vars` from contract | inline styles, raw CSS |
| Icons | existing icon components | new icon libraries |
| Translations | `useTranslation()` hook | hardcoded strings |

### Prefer Well-Known Libraries

Before implementing any non-trivial logic, search for established npm packages. Prefer battle-tested libraries over custom implementations.

| Task | Preferred Library |
|------|-------------------|
| OpenAPI parsing | `@readme/openapi-parser`, `swagger-parser` |
| JSON Schema validation | `ajv` |
| $ref resolution | `json-refs`, `@apidevtools/json-schema-ref-parser` |
| Date/time formatting | `date-fns` |
| Deep object merge | `deepmerge` |
| URL manipulation | `url-parse`, native `URL` API |
| Markdown rendering | `marked`, `markdown-it` |
| Code syntax highlighting | `prism-js`, `highlight.js` |
| Copy to clipboard | `clipboard-copy` |
| HTTP mocking (tests) | `msw` |

**Rule**: If a problem has a well-known solution with >1M weekly downloads, use it. Don't reinvent wheels.

### Anti-Patterns — DO NOT

- ❌ Reimplement logic that exists in popular npm packages
- ❌ Create new utility functions without checking existing ones
- ❌ Hardcode colors/spacing — use `vars` from theme contract
- ❌ Add UI strings without i18n (`t('key')`)
- ❌ Modify `packages/core/src/types/api.ts` without explicit approval
- ❌ Use React patterns (useState, useEffect) — this is SolidJS
- ❌ Create `.css` files — use `.css.ts` (Vanilla Extract)
- ❌ Import from `@wti/ui` in `@wti/core` (breaks dependency direction)

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

### SolidJS-Specific Reminders

- Props are accessed via `props.x`, not destructured (breaks reactivity)
- Use `<Show>` and `<For>` components, not ternaries/map for conditional rendering
- `createEffect` ≠ `useEffect` — different mental model
- Signals are functions: `count()` to read, `setCount(x)` to write