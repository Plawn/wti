# WTI - What The Interface
# Run `just` to see all available commands

# Default recipe: show help
default:
    @just --list

# ============================================
# Development
# ============================================

# Start the demo app development server
dev:
    bun run dev

# Start the UI package in watch mode
dev-ui:
    bun run --filter @wti/ui dev

# Start the core package in watch mode
dev-core:
    bun run --filter @wti/core dev

# ============================================
# Building
# ============================================

# Build all packages
build:
    bun run build

# Build only the demo app
build-demo:
    bun run build:demo

# Build only the UI package
build-ui:
    bun run --filter @wti/ui build

# Build only the core package
build-core:
    bun run --filter @wti/core build

# Build only the web component
build-element:
    bun run --filter @wti/element build

# Clean all dist folders
clean:
    rm -rf packages/*/dist apps/*/dist

# Clean and rebuild everything
rebuild: clean build

# ============================================
# Testing & Quality
# ============================================

# Run all tests
test:
    bun test

# Run tests for a specific package
test-core:
    bun test packages/core

# Run TypeScript type checking
typecheck:
    bun run typecheck

# Run linter (Biome)
lint:
    bun run lint

# Run linter and fix issues
lint-fix:
    bun run lint:fix

# Run all checks (typecheck + lint)
check: typecheck lint

# ============================================
# Installation
# ============================================

# Install all dependencies
install:
    bun install

# Update dependencies
update:
    bun update

# ============================================
# Preview & Serve
# ============================================

# Preview the built demo app
preview:
    bun run --filter @wti/demo preview

# Serve the web component test page
serve-element:
    cd packages/web-component && python3 -m http.server 8080

# ============================================
# Utilities
# ============================================

# Show package sizes
sizes:
    @echo "=== @wti/core ===" && du -sh packages/core/dist/* 2>/dev/null || echo "Not built"
    @echo "\n=== @wti/ui ===" && du -sh packages/ui/dist/*.{js,css} 2>/dev/null || echo "Not built"
    @echo "\n=== @wti/element ===" && du -sh packages/web-component/dist/*.{js,css} 2>/dev/null || echo "Not built"

# Generate a fresh lockfile
lockfile:
    rm -f bun.lock && bun install

# Open demo in browser (macOS)
open:
    open http://localhost:5173

# ============================================
# Release (future)
# ============================================

# Bump version (patch)
# version-patch:
#     bun run version:patch

# Publish packages
# publish:
#     bun run publish
