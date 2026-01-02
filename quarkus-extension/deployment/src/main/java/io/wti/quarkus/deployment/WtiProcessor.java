package io.wti.quarkus.deployment;

import io.quarkus.deployment.annotations.BuildProducer;
import io.quarkus.deployment.annotations.BuildStep;
import io.quarkus.deployment.annotations.ExecutionTime;
import io.quarkus.deployment.annotations.Record;
import io.quarkus.deployment.builditem.FeatureBuildItem;
import io.quarkus.deployment.builditem.LaunchModeBuildItem;
import io.quarkus.deployment.builditem.nativeimage.NativeImageResourceBuildItem;
import io.quarkus.vertx.http.deployment.NonApplicationRootPathBuildItem;
import io.quarkus.vertx.http.deployment.RouteBuildItem;
import io.quarkus.vertx.http.runtime.HandlerType;
import io.wti.quarkus.runtime.WtiConfig;
import io.wti.quarkus.runtime.WtiRecorder;

import java.util.List;

/**
 * Build steps for WTI Quarkus extension.
 */
public class WtiProcessor {

    private static final String FEATURE = "wti";
    private static final String WTI_WEBJAR_PREFIX = "META-INF/resources/wti/";
    private static final List<String> WTI_RESOURCES = List.of(
            "wti-element.iife.js",
            "wti-element.es.js",
            "wti-element.css"
    );

    @BuildStep
    FeatureBuildItem feature() {
        return new FeatureBuildItem(FEATURE);
    }

    @BuildStep
    void registerResources(BuildProducer<NativeImageResourceBuildItem> resources) {
        // Register WTI static resources for native image
        for (String resource : WTI_RESOURCES) {
            resources.produce(new NativeImageResourceBuildItem(WTI_WEBJAR_PREFIX + resource));
        }
    }

    @BuildStep
    @Record(ExecutionTime.RUNTIME_INIT)
    void registerRoutes(
            WtiConfig config,
            WtiRecorder recorder,
            LaunchModeBuildItem launchMode,
            NonApplicationRootPathBuildItem nonApplicationRootPath,
            BuildProducer<RouteBuildItem> routes) {

        // Skip if disabled
        if (!config.enable()) {
            return;
        }

        // Only include in dev/test mode unless alwaysInclude is set
        if (!config.alwaysInclude() && launchMode.getLaunchMode().isDevOrTest() == false) {
            return;
        }

        String path = config.path();
        String specUrl = config.specUrl();
        String title = config.title().orElse(null);
        String theme = config.theme();
        String locale = config.locale();

        // Redirect from base path to index.html
        routes.produce(nonApplicationRootPath.routeBuilder()
                .route(path)
                .handler(recorder.createRedirectHandler(path))
                .displayOnNotFoundPage("WTI API Documentation")
                .build());

        // Serve index.html with injected configuration
        routes.produce(nonApplicationRootPath.routeBuilder()
                .route(path + "/index.html")
                .handler(recorder.createIndexHandler(specUrl, title, theme, locale))
                .build());

        // Serve static resources from classpath
        routes.produce(nonApplicationRootPath.routeBuilder()
                .route(path + "/*")
                .handlerType(HandlerType.BLOCKING)
                .handler(recorder.createStaticHandler(path))
                .build());
    }
}
