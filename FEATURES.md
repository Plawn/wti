# WTI (What The Interface) - Complete Feature Tree

## Package Architecture
```
packages/
├── core/          # Framework-agnostic core logic
├── ui/            # SolidJS UI components
├── web-component/ # Custom HTML element wrapper
└── apps/demo/     # Demo application
```

---

## Core Features (@wti/core)

### API Parsing
- OpenAPI 3.0/3.1 parser (JSON/YAML)
- `$ref` dereferencing for schema resolution
- Schema validation and normalization
- Server variable substitution
- gRPC server reflection & service discovery

### HTTP Client
- Request execution with configurable timeout
- Query/header/cookie parameter building
- Request body serialization (JSON, form data)
- Response parsing with timing metrics
- AbortSignal cancellation support

### Code Generation
```
├── cURL commands
├── JavaScript (Fetch API)
├── Python (requests)
└── Go (net/http)
```

---

## UI Features (@wti/ui)

### Layout
- Two-pane responsive design (sidebar + content)
- iOS 26 glassmorphism design system
- Dark/Light theme toggle
- Mobile drawer navigation

### Sidebar Components
```
├── Operation Tree
│   ├── Tag-based grouping (collapsible)
│   ├── Fuzzy search (Fuse.js)
│   └── Default tag for untagged operations
├── Server Selector
│   ├── Multiple endpoints
│   └── Server variables
└── Authentication Panel (tabbed)
    ├── API Key (header/query/cookie)
    ├── Bearer Token
    ├── Basic Auth
    ├── OAuth2
    └── OpenID Connect (PKCE flow)
```

### Operation Panel
```
├── Header
│   ├── Method badge (color-coded)
│   ├── Path, summary, description
│   └── Deprecation warnings
├── Parameters
│   ├── Path/Query/Header/Cookie inputs
│   ├── Required field validation
│   └── Schema constraint validation
├── Request Body
│   ├── JSON editor mode
│   ├── Form view mode
│   └── Content-Type detection
├── Code Snippets
│   ├── Multi-language tabs
│   ├── Syntax highlighting
│   └── Copy to clipboard
└── Response Display
    ├── Status code (color-coded)
    ├── Headers viewer
    ├── JSON tree viewer
    └── Timing metrics
```

### Command Palette (Cmd/Ctrl+P)
- Fuzzy search across operations
- Recent operations tracking
- Keyboard navigation

### History Drawer
- Request/response persistence (IndexedDB)
- Replay functionality
- Export/import as JSON
- Auto-pruning (max 500 entries)

---

## Authentication

| Type | Features |
|------|----------|
| API Key | Header/query/cookie placement |
| Bearer | Custom scheme support |
| Basic | Username/password with Base64 |
| OAuth2 | Token refresh, scopes |
| OIDC | PKCE flow, auto-refresh, discovery caching |

---

## State Management

### Stores
```
├── spec.ts     # API spec, selection, search
├── auth.ts     # Authentication state
└── history.ts  # Request history
```

### Persistence
- IndexedDB for auth & history
- LocalStorage for recent operations
- URL sync for deep linking

---

## Internationalization

- Locales: `en`, `fr`
- Type-safe translation keys
- `useI18n()` hook: `{ t, locale }`

---

## Theming & Styling

### Glass Utilities
```css
.glass          /* Standard */
.glass-thick    /* High opacity */
.glass-thin     /* Transparent */
.glass-card     /* Card surfaces */
.glass-input    /* Form inputs */
.glass-button   /* Buttons */
.glass-sidebar  /* Sidebar */
```

### Design Tokens
- OKLCH color space
- Backdrop blur (30-60px)
- Dark mode support
- Custom scrollbars

---

## Responsive Design

| Viewport | Behavior |
|----------|----------|
| Mobile | Drawer navigation, full-screen panels |
| Desktop | Fixed sidebar (320px), two-pane layout |

---

## Performance

- Memoized Fuse.js search
- Paginated history (20/page)
- SolidJS fine-grained reactivity
- Lazy code generator imports

---

## Web Component (@wti/element)

```html
<wti-element
  spec-url="/openapi.json"
  spec-type="openapi"
  theme="dark"
  locale="en"
/>
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl+P | Command palette |
| Up/Down | Navigate results |
| Enter | Select operation |
| Escape | Close palette |
