# WTI Quarkus Extension

Quarkus extension for WTI (What The Interface) - A modern API documentation UI.

## Requirements

- **Quarkus**: 3.2.0 or later (tested with 3.8.x, 3.15.x, 3.30.x)
- **Java**: 17 or later

## Building

### Using Just (recommended)

From the project root:

```bash
# Full build: WTI + Quarkus extension
just build-quarkus

# Fast rebuild (skip WTI build)
just build-quarkus-fast

# Clean build artifacts
just clean-quarkus
```

### Manual Build

```bash
# 1. Build WTI web component
bun run --filter @wti/element build

# 2. Copy assets to extension
mkdir -p quarkus-extension/runtime/src/main/resources/META-INF/resources/wti
cp -r packages/web-component/dist/* quarkus-extension/runtime/src/main/resources/META-INF/resources/wti/

# 3. Build Maven package
cd quarkus-extension && mvn clean install
```

## Usage

Add the dependency to your Quarkus project:

```xml
<dependency>
    <groupId>io.wti</groupId>
    <artifactId>quarkus-wti</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

Make sure you also have the OpenAPI extension:

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-smallrye-openapi</artifactId>
</dependency>
```

## Configuration

Add to `application.properties`:

```properties
# Enable/disable WTI UI (default: true)
quarkus.wti.enable=true

# Path where WTI will be served (default: /api-docs)
quarkus.wti.path=/api-docs

# OpenAPI spec URL (default: /q/openapi)
quarkus.wti.spec-url=/q/openapi

# Custom title for the documentation
quarkus.wti.title=My API Documentation

# Theme: light, dark, or system (default: system)
quarkus.wti.theme=system

# Locale: en or fr (default: en)
quarkus.wti.locale=en

# Include in production builds (default: false, only dev/test)
quarkus.wti.always-include=false
```

## Accessing the UI

Start your Quarkus application and navigate to:

```
http://localhost:8080/api-docs
```

## Disabling Swagger UI

To use WTI instead of the default Swagger UI, disable it in your `application.properties`:

```properties
quarkus.swagger-ui.enable=false
quarkus.wti.enable=true
```

## Development

### Project Structure

```
quarkus-extension/
├── pom.xml                 # Parent POM
├── runtime/                # Runtime module
│   ├── pom.xml
│   └── src/main/
│       ├── java/io/wti/quarkus/runtime/
│       │   ├── WtiConfig.java      # Configuration interface
│       │   └── WtiRecorder.java    # Runtime recorder
│       └── resources/META-INF/resources/wti/
│           └── (WTI static assets)
└── deployment/             # Deployment module
    ├── pom.xml
    └── src/main/java/io/wti/quarkus/deployment/
        ├── WtiProcessor.java       # Build steps
        └── WtiStaticHandler.java   # Static file handler
```

### Updating WTI Version

1. Rebuild WTI: `just build-quarkus`
2. Bump version in parent `pom.xml`
3. Rebuild: `just build-quarkus-fast`

## Releasing to Maven Central

### GitHub Actions (Automated)

The extension is automatically published to Maven Central when you push a tag:

```bash
# Tag a release
git tag quarkus-v1.0.0
git push origin quarkus-v1.0.0
```

Or trigger manually via GitHub Actions workflow dispatch.

### Required GitHub Secrets

Configure these secrets in your repository settings:

| Secret | Description |
|--------|-------------|
| `OSSRH_USERNAME` | Sonatype OSSRH username |
| `OSSRH_TOKEN` | Sonatype OSSRH token |
| `GPG_PRIVATE_KEY` | GPG private key for signing (armored) |
| `GPG_PASSPHRASE` | GPG key passphrase |

### Getting Sonatype Credentials

1. Create account at https://issues.sonatype.org
2. Create a new project ticket for `io.wti` namespace
3. Once approved, get token from https://s01.oss.sonatype.org

### Generating GPG Key

```bash
# Generate key
gpg --full-generate-key

# Export private key (for GitHub secret)
gpg --armor --export-secret-keys YOUR_KEY_ID

# Export public key (upload to keyserver)
gpg --armor --export YOUR_KEY_ID
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID
```

### Local Release (Manual)

```bash
cd quarkus-extension

# Set version
mvn versions:set -DnewVersion=1.0.0 -DgenerateBackupPoms=false

# Deploy
mvn clean deploy -P release
```
