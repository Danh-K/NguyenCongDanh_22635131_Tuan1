package iuh.fit.microkernel.kernel.web;

import iuh.fit.microkernel.kernel.model.PluginDescriptor;
import iuh.fit.microkernel.kernel.service.KernelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/mk/kernel/plugins")
public class KernelController {

    private final KernelService kernelService;

    public KernelController(KernelService kernelService) {
        this.kernelService = kernelService;
    }

    @GetMapping
    public List<PluginDescriptor> list() {
        return kernelService.listPlugins();
    }

    @PatchMapping("/{pluginCode}/activate")
    public PluginDescriptor activate(@PathVariable String pluginCode) {
        return kernelService.activate(pluginCode);
    }

    @PatchMapping("/{pluginCode}/deactivate")
    public PluginDescriptor deactivate(@PathVariable String pluginCode) {
        return kernelService.deactivate(pluginCode);
    }

    @PutMapping("/{pluginCode}/config")
    public PluginDescriptor configure(@PathVariable String pluginCode,
                                      @RequestBody Map<String, String> config) {
        return kernelService.configure(pluginCode, config);
    }

    @GetMapping("/{pluginCode}/operations")
    public Set<String> listOperations(@PathVariable String pluginCode) {
        return kernelService.listOperations(pluginCode);
    }

    @PostMapping("/{pluginCode}/execute/{operation}")
    public Object execute(@PathVariable String pluginCode,
                          @PathVariable String operation,
                          @RequestBody(required = false) Map<String, Object> payload) {
        return kernelService.execute(pluginCode, operation, payload);
    }
}
