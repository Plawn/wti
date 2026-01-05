package io.wti.quarkus.runtime;

import io.quarkus.runtime.annotations.ConfigPhase;
import io.quarkus.runtime.annotations.ConfigRoot;
import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;

import java.util.Optional;

/**
 * Configuration for WTI (What The Interface) UI.
 */
@ConfigMapping(prefix = "quarkus.wti")
@ConfigRoot(phase = ConfigPhase.BUILD_AND_RUN_TIME_FIXED)
public interface WtiConfig {

    /**
     * If WTI UI should be enabled.
     */
    @WithDefault("true")
    boolean enable();

    /**
     * The path where WTI UI will be served.
     */
    @WithDefault("/api-docs")
    String path();

    /**
     * The URL to the OpenAPI specification.
     * Defaults to Quarkus's standard OpenAPI endpoint.
     */
    @WithDefault("/q/openapi")
    String specUrl();

    /**
     * The title to display in the UI.
     * Used for the page title and Open Graph og:title meta tag.
     */
    Optional<String> title();

    /**
     * The description for Open Graph meta tags (og:description).
     * Used for link previews on Slack, Discord, Twitter, etc.
     */
    Optional<String> description();

    /**
     * Whether to always include WTI UI, even in production.
     * By default, WTI UI is only included in dev and test modes.
     */
    @WithDefault("false")
    boolean alwaysInclude();

    /**
     * The theme to use: 'light', 'dark', or 'system'.
     */
    @WithDefault("system")
    String theme();

    /**
     * The locale for the UI: 'en' or 'fr'.
     */
    @WithDefault("en")
    String locale();
}
