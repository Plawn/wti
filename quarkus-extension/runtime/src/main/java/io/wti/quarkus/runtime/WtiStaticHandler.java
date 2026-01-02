package io.wti.quarkus.runtime;

import io.vertx.core.Handler;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpHeaders;
import io.vertx.ext.web.RoutingContext;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

/**
 * Handler for serving WTI static resources from the classpath.
 */
public class WtiStaticHandler implements Handler<RoutingContext> {

    private static final String RESOURCE_PREFIX = "META-INF/resources/wti/";

    private static final Map<String, String> CONTENT_TYPES = Map.of(
            ".html", "text/html;charset=UTF-8",
            ".js", "application/javascript;charset=UTF-8",
            ".mjs", "application/javascript;charset=UTF-8",
            ".css", "text/css;charset=UTF-8",
            ".json", "application/json;charset=UTF-8",
            ".svg", "image/svg+xml",
            ".png", "image/png",
            ".ico", "image/x-icon",
            ".woff", "font/woff",
            ".woff2", "font/woff2"
    );

    private final String basePath;

    public WtiStaticHandler(String basePath) {
        this.basePath = basePath;
    }

    @Override
    public void handle(RoutingContext ctx) {
        String path = ctx.normalizedPath();

        // Remove base path prefix
        String resourcePath = path.substring(basePath.length());
        if (resourcePath.startsWith("/")) {
            resourcePath = resourcePath.substring(1);
        }

        // Skip index.html - handled separately
        if (resourcePath.isEmpty() || resourcePath.equals("index.html")) {
            ctx.next();
            return;
        }

        // Security: prevent path traversal
        if (resourcePath.contains("..")) {
            ctx.response().setStatusCode(400).end("Invalid path");
            return;
        }

        String fullPath = RESOURCE_PREFIX + resourcePath;

        try (InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(fullPath)) {
            if (is == null) {
                ctx.response().setStatusCode(404).end("Not found: " + resourcePath);
                return;
            }

            byte[] bytes = is.readAllBytes();
            String contentType = getContentType(resourcePath);

            ctx.response()
                    .putHeader(HttpHeaders.CONTENT_TYPE, contentType)
                    .putHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .end(Buffer.buffer(bytes));

        } catch (IOException e) {
            ctx.response().setStatusCode(500).end("Error reading resource");
        }
    }

    private String getContentType(String path) {
        for (Map.Entry<String, String> entry : CONTENT_TYPES.entrySet()) {
            if (path.endsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "application/octet-stream";
    }
}
