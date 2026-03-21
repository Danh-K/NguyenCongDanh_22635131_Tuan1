package iuh.fit.layer.plugin.spi;

import java.util.Map;

public interface CmsPlugin {
    String pluginCode();

    String displayName();

    default void onEnable(Map<String, String> config) {
        // Default no-op hook.
    }

    default void onDisable() {
        // Default no-op hook.
    }
}
