# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-01-22

### Fixed

- TypeScript configuration improvements

## [0.2.7] - 2026-01-15

### Added

- **Glass UI Components** - 26 new glassmorphism components integrated into `@wti/ui`
  - Data Display: Table, Card, Avatar, Skeleton, Progress, Chip
  - Navigation: Menu, Dropdown, Breadcrumb, Pagination
  - Feedback: Alert, Dialog, Snackbar
  - Forms: Enhanced Input, Textarea, Select, Checkbox with size variants
  - Improved Button with size variants and icon slots
- **New Hooks**: `useDisclosure`, `useCopyToClipboard`
- **@wti/history Package** - Extracted history management as standalone package

### Changed

- Finalized Glass UI migration - components now built into `@wti/ui`
- Improved theming system with better dark/light mode support
- Bundle optimizations (538.26 kB / 139.23 kB gzip for @wti/ui)

### Fixed

- gRPC support improvements
- Light mode styling fixes
- History handling improvements

## [0.2.0] - 2026-01-10

### Added

- **Quarkus Extension** - Java/Quarkus integration for WTI
- **Open Graph meta tags** - Better link previews when sharing
- **OIDC improvements** - Enhanced OpenID Connect flow

### Changed

- Mobile UI improvements and responsive design
- Upgraded Vite build tooling
- Search bar enhancements
- Response display improvements

### Fixed

- Extension configuration
- OpenID auto-refresh token handling
- Mobile UI layout issues

## [0.1.0] - 2024-12-29

### Added

- **OpenAPI Support**
  - OpenAPI 3.0 and 3.1 parsing
  - Automatic `$ref` resolution
  - Server selection with variables
  - Security schemes extraction

- **gRPC Support**
  - gRPC-Web client
  - Server Reflection for service discovery
  - Proto to unified type conversion

- **UI Components**
  - iOS 26-inspired glassmorphism design
  - Dark/Light theme support
  - Sidebar with operation tree and search
  - Parameter forms with validation
  - Request body editor (JSON/Form modes)
  - Response viewer with syntax highlighting
  - Code snippets (cURL, JavaScript, Python, Go)
  - Request history with replay

- **Authentication**
  - API Key (header, query, cookie)
  - Bearer token
  - Basic auth
  - OAuth2 (Authorization Code, Client Credentials, Implicit, Password)
  - OpenID Connect with PKCE
  - Automatic token refresh

- **Internationalization**
  - English and French translations

- **Distribution**
  - SolidJS library (`@wti/ui`)
  - Web Component (`<wti-element>` via `@wti/element`)
  - Standalone IIFE bundle for vanilla HTML

[0.3.0]: https://github.com/plawn/wti/releases/tag/v0.3.0
[0.2.7]: https://github.com/plawn/wti/releases/tag/v0.2.7
[0.2.0]: https://github.com/plawn/wti/releases/tag/v0.2.0
[0.1.0]: https://github.com/plawn/wti/releases/tag/v0.1.0
