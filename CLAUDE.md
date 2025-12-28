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
