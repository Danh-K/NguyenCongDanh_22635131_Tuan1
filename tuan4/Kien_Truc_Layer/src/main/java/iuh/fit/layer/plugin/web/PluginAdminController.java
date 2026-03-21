package iuh.fit.layer.plugin.web;

import iuh.fit.layer.plugin.model.PluginConfigEntity;
import iuh.fit.layer.plugin.service.PluginService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/plugins")
public class PluginAdminController {

    private final PluginService pluginService;

    public PluginAdminController(PluginService pluginService) {
        this.pluginService = pluginService;
    }

    @GetMapping
    public List<PluginConfigEntity> list() {
        return pluginService.listAll();
    }

    @PutMapping("/{pluginCode}")
    public PluginConfigEntity upsert(@PathVariable String pluginCode,
                                     @RequestBody PluginUpsertRequest request) {
        return pluginService.upsert(pluginCode, request.config(), request.enabled());
    }

    @PatchMapping("/{pluginCode}/activate")
    public PluginConfigEntity activate(@PathVariable String pluginCode) {
        return pluginService.activate(pluginCode);
    }

    @PatchMapping("/{pluginCode}/deactivate")
    public PluginConfigEntity deactivate(@PathVariable String pluginCode) {
        return pluginService.deactivate(pluginCode);
    }

    public record PluginUpsertRequest(Map<String, String> config, boolean enabled) {
    }
}
