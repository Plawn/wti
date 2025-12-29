# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - Web Component (`@wti/element`)
  - Standalone IIFE bundle for vanilla HTML

[0.1.0]: https://github.com/plawn/wti/releases/tag/v0.1.0
