package iuh.fit.microkernel.analytics;

import iuh.fit.microkernel.kernel.spi.KernelPlugin;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsPlugin implements KernelPlugin {

    public static final String CODE = "analytics-plugin";

    @Override
    public String pluginCode() {
        return CODE;
    }

    @Override
    public String displayName() {
        return "Analytics Plugin";
    }

    @Override
    public String description() {
        return "Sample extension point for analytics integration";
    }
}
