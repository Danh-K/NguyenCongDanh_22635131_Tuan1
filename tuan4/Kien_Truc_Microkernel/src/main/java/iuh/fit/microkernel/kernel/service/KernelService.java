package iuh.fit.microkernel.kernel.service;

import iuh.fit.microkernel.kernel.model.PluginDescriptor;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface KernelService {
    List<PluginDescriptor> listPlugins();

    PluginDescriptor activate(String pluginCode);

    PluginDescriptor deactivate(String pluginCode);

    PluginDescriptor configure(String pluginCode, Map<String, String> config);

    boolean isActive(String pluginCode);

    Set<String> listOperations(String pluginCode);

    Object execute(String pluginCode, String operation, Map<String, Object> payload);
}
