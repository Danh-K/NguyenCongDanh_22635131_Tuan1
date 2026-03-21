package iuh.fit.layer.plugin.service;

import iuh.fit.layer.plugin.model.PluginConfigEntity;

import java.util.List;
import java.util.Map;

public interface PluginService {
    List<PluginConfigEntity> listAll();

    PluginConfigEntity upsert(String pluginCode, Map<String, String> config, boolean enabled);

    PluginConfigEntity activate(String pluginCode);

    PluginConfigEntity deactivate(String pluginCode);
}
