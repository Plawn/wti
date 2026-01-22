# WTI - What The Interface

A modern API documentation explorer supporting OpenAPI and gRPC. Built with SolidJS and Tailwind CSS v4.

## Features

- OpenAPI 3.0/3.1 support
- gRPC support via Server Reflection
- Beautiful iOS 26-inspired glassmorphism UI
- Dark/Light theme
- i18n (English/French)
- Full authentication support (API Key, Bearer, Basic, OAuth2, OpenID Connect)
- Web Component for framework-agnostic usage

## Installation

### As a SolidJS Component

```bash
npm install @wti/ui @wti/core solid-js
# or
bun add @wti/ui @wti/core solid-js
```

```tsx
import { WTI } from '@wti/ui';
import '@wti/ui/styles.css';

function App() {
  return (
    <WTI
      spec={{ type: 'openapi', url: 'https://petstore3.swagger.io/api/v3/openapi.json' }}
      theme="dark"
      locale="en"
    />
  );
}
```

### As a Web Component (Vanilla HTML)

Download the files from `@wti/element` or use a CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation</title>
  <link rel="stylesheet" href="wti-element.css">
</head>
<body>
  <wti-element
    spec-url="https://petstore3.swagger.io/api/v3/openapi.json"
    theme="dark"
    locale="en"
  ></wti-element>

  <script src="wti-element.iife.js"></script>
</body>
</html>
```

#### Web Component Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `spec-url` | string | `""` | URL to OpenAPI spec or gRPC endpoint |
| `spec-type` | `"openapi"` \| `"grpc"` | `"openapi"` | Type of API specification |
| `theme` | `"light"` \| `"dark"` | `"light"` | Color theme |
| `locale` | `"en"` \| `"fr"` | `"en"` | UI language |

#### Dynamic Updates

Attributes can be changed dynamically:

```javascript
const wti = document.querySelector('wti-element');

// Change theme
wti.setAttribute('theme', 'light');

// Load a different API
wti.setAttribute('spec-url', 'https://api.example.com/openapi.json');

// Change language
wti.setAttribute('locale', 'fr');
```

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0

### Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build all packages
bun run build

# Run type checking
bun run typecheck

# Run linter
bun run lint

# Fix lint issues
bun run lint:fix

# Run tests
bun test
```

### Project Structure

```
wti/
├── apps/
│   └── demo/              # Demo application
├── packages/
│   ├── core/              # Core logic (parser, HTTP client, types)
│   ├── ui/                # SolidJS UI components
│   └── web-component/     # Web Component wrapper
└── justfile               # Task runner commands
```

## Packages

| Package | Description |
|---------|-------------|
| `@wti/core` | Framework-agnostic core: OpenAPI parser, HTTP client, gRPC client |
| `@wti/ui` | SolidJS UI components with Tailwind CSS |
| `@wti/element` | Web Component for vanilla HTML usage |

## Releasing

### Prerequisites

- Ensure you're logged in to npm: `npm login`
- Ensure all tests pass: `bun test`
- Ensure the build succeeds: `bun run build`

### Release Process

1. **Update versions** in each package you want to release:
   ```bash
   # Update version in packages/core/package.json
   # Update version in packages/ui/package.json
   # Update version in packages/web-component/package.json
   ```

2. **Ensure dependency versions are aligned** - if `@wti/ui` depends on `@wti/core`, update that dependency version too.

3. **Build all packages**:
   ```bash
   bun run build
   ```

4. **Publish packages in order** (respecting dependencies):
   ```bash
   # 1. Core first (no internal dependencies)
   cd packages/core && npm publish --access public

   # 2. UI second (depends on core)
   cd packages/ui && npm publish --access public

   # 3. Web component last (depends on ui)
   cd packages/web-component && npm publish --access public
   ```

5. **Create a git tag**:
   ```bash
   git tag v0.x.x
   git push origin v0.x.x
   ```

### Version Bump Guidelines

- **Patch** (0.0.x): Bug fixes, documentation updates
- **Minor** (0.x.0): New features, non-breaking changes
- **Major** (x.0.0): Breaking API changes

## License

MIT
