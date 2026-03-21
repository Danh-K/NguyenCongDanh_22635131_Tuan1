package iuh.fit.layer.plugin.spi;

import org.springframework.stereotype.Component;

@Component
public class AnalyticsPlugin implements CmsPlugin {

    @Override
    public String pluginCode() {
        return "analytics";
    }

    @Override
    public String displayName() {
        return "Analytics Plugin";
    }
}
