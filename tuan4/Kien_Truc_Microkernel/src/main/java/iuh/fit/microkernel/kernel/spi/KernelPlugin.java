package iuh.fit.microkernel.kernel.spi;

import java.util.Map;

public interface KernelPlugin {
    String pluginCode();

    String displayName();

    default String description() {
        return "";
    }

    default void onStart(Map<String, String> config) {
        // default no-op
    }

    default void onStop() {
        // default no-op
    }

    default boolean supports(String operation) {
        return false;
    }

    default Object execute(String operation, Map<String, Object> payload) {
        throw new UnsupportedOperationException("Plugin does not support operation: " + operation);
    }
}
