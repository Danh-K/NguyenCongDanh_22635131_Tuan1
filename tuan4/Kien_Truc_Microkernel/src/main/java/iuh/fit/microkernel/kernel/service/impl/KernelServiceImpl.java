package iuh.fit.microkernel.kernel.service.impl;

import iuh.fit.microkernel.kernel.model.PluginDescriptor;
import iuh.fit.microkernel.kernel.model.PluginState;
import iuh.fit.microkernel.kernel.repository.PluginDescriptorRepository;
import iuh.fit.microkernel.kernel.service.KernelService;
import iuh.fit.microkernel.kernel.spi.KernelPlugin;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class KernelServiceImpl implements KernelService {

    private static final Logger log = LoggerFactory.getLogger(KernelServiceImpl.class);

    private final PluginDescriptorRepository pluginDescriptorRepository;
    private final Map<String, KernelPlugin> runtimePlugins;

    public KernelServiceImpl(PluginDescriptorRepository pluginDescriptorRepository, List<KernelPlugin> plugins) {
        this.pluginDescriptorRepository = pluginDescriptorRepository;
        this.runtimePlugins = plugins.stream()
                .collect(Collectors.toMap(KernelPlugin::pluginCode, Function.identity(), (a, b) -> a));
    }

    @PostConstruct
    public void bootstrapRuntimePlugins() {
        try {
            List<PluginDescriptor> all = pluginDescriptorRepository.findAll();

            for (KernelPlugin plugin : runtimePlugins.values()) {
                Optional<PluginDescriptor> existing = all.stream()
                        .filter(d -> d.getPluginCode().equals(plugin.pluginCode()))
                        .findFirst();
                if (existing.isPresent()) {
                    PluginDescriptor descriptor = existing.get();
                    if (descriptor.getState() == PluginState.ACTIVE) {
                        plugin.onStart(descriptor.getConfig());
                    }
                    continue;
                }

                PluginDescriptor descriptor = new PluginDescriptor();
                descriptor.setPluginCode(plugin.pluginCode());
                descriptor.setDisplayName(plugin.displayName());
                descriptor.setDescription(plugin.description());
                descriptor.setState(PluginState.INACTIVE);
                descriptor.setCreatedAt(Instant.now());
                descriptor.setUpdatedAt(Instant.now());
                pluginDescriptorRepository.save(descriptor);
            }
        } catch (RuntimeException ex) {
            log.warn("Kernel bootstrap skipped because plugin store is unavailable: {}", ex.getMessage());
        }
    }

    @Override
    public List<PluginDescriptor> listPlugins() {
        return pluginDescriptorRepository.findAll();
    }

    @Override
    public PluginDescriptor activate(String pluginCode) {
        PluginDescriptor descriptor = findByCode(pluginCode);
        descriptor.setState(PluginState.ACTIVE);
        descriptor.setUpdatedAt(Instant.now());
        PluginDescriptor saved = pluginDescriptorRepository.save(descriptor);

        KernelPlugin plugin = runtimePlugins.get(pluginCode);
        if (plugin != null) {
            plugin.onStart(saved.getConfig());
        }
        return saved;
    }

    @Override
    public PluginDescriptor deactivate(String pluginCode) {
        PluginDescriptor descriptor = findByCode(pluginCode);
        descriptor.setState(PluginState.INACTIVE);
        descriptor.setUpdatedAt(Instant.now());
        PluginDescriptor saved = pluginDescriptorRepository.save(descriptor);

        KernelPlugin plugin = runtimePlugins.get(pluginCode);
        if (plugin != null) {
            plugin.onStop();
        }
        return saved;
    }

    @Override
    public PluginDescriptor configure(String pluginCode, Map<String, String> config) {
        PluginDescriptor descriptor = findByCode(pluginCode);
        descriptor.setConfig(config == null ? new HashMap<>() : new HashMap<>(config));
        descriptor.setUpdatedAt(Instant.now());
        return pluginDescriptorRepository.save(descriptor);
    }

    @Override
    public boolean isActive(String pluginCode) {
        return pluginDescriptorRepository.findByPluginCode(pluginCode)
                .map(d -> d.getState() == PluginState.ACTIVE)
                .orElse(false);
    }

    @Override
    public Set<String> listOperations(String pluginCode) {
        KernelPlugin plugin = requirePlugin(pluginCode);
        return Set.of(
                "list",
                "detail",
                "create",
                "update",
                "delete",
                "publish",
                "upsert"
        ).stream().filter(plugin::supports).collect(Collectors.toSet());
    }

    @Override
    public Object execute(String pluginCode, String operation, Map<String, Object> payload) {
        if (!isActive(pluginCode)) {
            throw new IllegalStateException("Plugin is inactive: " + pluginCode);
        }

        KernelPlugin plugin = requirePlugin(pluginCode);
        if (!plugin.supports(operation)) {
            throw new IllegalArgumentException("Operation not supported: " + operation + " for plugin " + pluginCode);
        }

        Map<String, Object> safePayload = payload == null ? Map.of() : payload;
        return plugin.execute(operation, safePayload);
    }

    private KernelPlugin requirePlugin(String pluginCode) {
        KernelPlugin plugin = runtimePlugins.get(pluginCode);
        if (plugin == null) {
            throw new IllegalArgumentException("Plugin not found in runtime: " + pluginCode);
        }
        return plugin;
    }

    private PluginDescriptor findByCode(String pluginCode) {
        return pluginDescriptorRepository.findByPluginCode(pluginCode)
                .orElseThrow(() -> new IllegalArgumentException("Plugin not found: " + pluginCode));
    }
}
