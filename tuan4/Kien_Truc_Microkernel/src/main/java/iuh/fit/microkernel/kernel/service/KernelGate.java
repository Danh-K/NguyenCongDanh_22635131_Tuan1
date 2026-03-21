package iuh.fit.microkernel.kernel.service;

import org.springframework.stereotype.Component;

@Component
public class KernelGate {

    private final KernelService kernelService;

    public KernelGate(KernelService kernelService) {
        this.kernelService = kernelService;
    }

    public void requireActive(String pluginCode) {
        if (!kernelService.isActive(pluginCode)) {
            throw new IllegalStateException("Plugin is inactive: " + pluginCode);
        }
    }
}
