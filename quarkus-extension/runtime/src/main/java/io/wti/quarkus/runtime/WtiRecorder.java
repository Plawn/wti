package io.wti.quarkus.runtime;

import io.quarkus.runtime.annotations.Recorder;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpHeaders;
import io.vertx.ext.web.RoutingContext;

/**
 * Recorder for WTI UI runtime configuration.
 */
@Recorder
public class WtiRecorder {

    /**
     * Creates a handler that redirects from the base path to index.html.
     */
    public Handler<RoutingContext> createRedirectHandler(String path) {
        return new Handler<RoutingContext>() {
            @Override
            public void handle(RoutingContext event) {
                event.response()
                        .setStatusCode(302)
                        .putHeader(HttpHeaders.LOCATION, path + "/index.html")
                        .end();
            }
        };
    }

    /**
     * Creates a handler that serves static resources.
     */
    public Handler<RoutingContext> createStaticHandler(String basePath) {
        return new WtiStaticHandler(basePath);
    }

    /**
     * Creates a handler that serves the index.html with injected configuration.
     */
    public Handler<RoutingContext> createIndexHandler(String specUrl, String title, String description, String theme, String locale) {
        return new Handler<RoutingContext>() {
            @Override
            public void handle(RoutingContext event) {
                String baseUrl = getBaseUrl(event);
                String html = generateIndexHtml(specUrl, title, description, theme, locale, baseUrl);
                event.response()
                        .putHeader(HttpHeaders.CONTENT_TYPE, "text/html;charset=UTF-8")
                        .end(html);
            }
        };
    }

    private String getBaseUrl(RoutingContext event) {
        String scheme = event.request().scheme();
        String host = event.request().host();
        String path = event.request().path();
        return scheme + "://" + host + path;
    }

    private String generateIndexHtml(String specUrl, String title, String description, String theme, String locale, String baseUrl) {
        String displayTitle = title != null ? title : "API Documentation";
        String displayDescription = description != null ? description : "Interactive API documentation";
        String darkClass = "dark".equals(theme) ? "dark" : "";

        return """
<!DOCTYPE html>
<html lang="%s" class="%s">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s</title>
    <meta name="description" content="%s">

    <!-- Open Graph / Facebook / Slack / Discord -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="%s">
    <meta property="og:title" content="%s">
    <meta property="og:description" content="%s">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="%s">
    <meta name="twitter:description" content="%s">

    <script>
        // Handle system theme preference
        if ('%s' === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            }
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                document.documentElement.classList.toggle('dark', e.matches);
            });
        }
    </script>
    <style>
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }
        wti-element {
            display: block;
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <wti-element
        spec-url="%s"
        locale="%s"
    ></wti-element>
    <script src="wti-element.iife.js"></script>
    <link rel="stylesheet" href="wti-element.css">
</body>
</html>
""".formatted(
                locale, darkClass,
                escapeHtml(displayTitle),
                escapeHtml(displayDescription),
                escapeHtml(baseUrl),
                escapeHtml(displayTitle),
                escapeHtml(displayDescription),
                escapeHtml(displayTitle),
                escapeHtml(displayDescription),
                theme,
                specUrl, locale
        );
    }

    private String escapeHtml(String text) {
        if (text == null) {
            return "";
        }
        return text
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
