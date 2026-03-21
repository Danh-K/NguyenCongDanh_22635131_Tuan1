package iuh.fit.layer.plugin.service.impl;

import iuh.fit.layer.plugin.model.PluginConfigEntity;
import iuh.fit.layer.plugin.repository.PluginConfigRepository;
import iuh.fit.layer.plugin.service.PluginService;
import iuh.fit.layer.plugin.spi.CmsPlugin;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PluginServiceImpl implements PluginService {

    private final PluginConfigRepository pluginConfigRepository;
    private final Map<String, CmsPlugin> pluginRuntimeMap;

    public PluginServiceImpl(PluginConfigRepository pluginConfigRepository, List<CmsPlugin> plugins) {
        this.pluginConfigRepository = pluginConfigRepository;
        this.pluginRuntimeMap = plugins.stream()
                .collect(Collectors.toMap(CmsPlugin::pluginCode, Function.identity(), (a, b) -> a));
    }

    @Override
    public List<PluginConfigEntity> listAll() {
        List<PluginConfigEntity> persisted = pluginConfigRepository.findAll();

        for (CmsPlugin plugin : pluginRuntimeMap.values()) {
            Optional<PluginConfigEntity> found = persisted.stream()
                    .filter(p -> p.getPluginCode().equals(plugin.pluginCode()))
                    .findFirst();
            if (found.isEmpty()) {
                PluginConfigEntity newEntity = new PluginConfigEntity();
                newEntity.setPluginCode(plugin.pluginCode());
                newEntity.setDisplayName(plugin.displayName());
                newEntity.setDescription("Runtime discovered plugin");
                newEntity.setVersion("1.0.0");
                newEntity.setEnabled(false);
                newEntity.setCreatedAt(Instant.now());
                newEntity.setUpdatedAt(Instant.now());
                persisted.add(pluginConfigRepository.save(newEntity));
            }
        }

        return persisted;
    }

    @Override
    public PluginConfigEntity upsert(String pluginCode, Map<String, String> config, boolean enabled) {
        PluginConfigEntity entity = pluginConfigRepository.findByPluginCode(pluginCode)
                .orElseGet(() -> {
                    PluginConfigEntity created = new PluginConfigEntity();
                    created.setPluginCode(pluginCode);
                    created.setDisplayName(pluginCode);
                    created.setCreatedAt(Instant.now());
                    return created;
                });

        entity.setConfig(config == null ? new HashMap<>() : new HashMap<>(config));
        entity.setEnabled(enabled);
        entity.setUpdatedAt(Instant.now());

        PluginConfigEntity saved = pluginConfigRepository.save(entity);
        invokePluginHook(saved);
        return saved;
    }

    @Override
    public PluginConfigEntity activate(String pluginCode) {
        return setStatus(pluginCode, true);
    }

    @Override
    public PluginConfigEntity deactivate(String pluginCode) {
        return setStatus(pluginCode, false);
    }

    private PluginConfigEntity setStatus(String pluginCode, boolean enabled) {
        PluginConfigEntity entity = pluginConfigRepository.findByPluginCode(pluginCode)
                .orElseThrow(() -> new IllegalArgumentException("Plugin not found: " + pluginCode));
        entity.setEnabled(enabled);
        entity.setUpdatedAt(Instant.now());
        PluginConfigEntity saved = pluginConfigRepository.save(entity);
        invokePluginHook(saved);
        return saved;
    }

    private void invokePluginHook(PluginConfigEntity plugin) {
        CmsPlugin runtimePlugin = pluginRuntimeMap.get(plugin.getPluginCode());
        if (runtimePlugin == null) {
            return;
        }

        if (plugin.isEnabled()) {
            runtimePlugin.onEnable(plugin.getConfig());
        } else {
            runtimePlugin.onDisable();
        }
    }
}
