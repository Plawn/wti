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
  <wti-explorer
    spec-url="https://petstore3.swagger.io/api/v3/openapi.json"
    theme="dark"
    locale="en"
  ></wti-explorer>

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
const wti = document.querySelector('wti-explorer');

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

## License

MIT
