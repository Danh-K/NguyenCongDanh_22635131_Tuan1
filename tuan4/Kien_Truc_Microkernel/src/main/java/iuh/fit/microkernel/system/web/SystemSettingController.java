package iuh.fit.microkernel.system.web;

import iuh.fit.microkernel.kernel.service.KernelService;
import iuh.fit.microkernel.system.SystemPlugin;
import iuh.fit.microkernel.system.model.SystemSetting;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mk/settings")
public class SystemSettingController {

    private final KernelService kernelService;

    public SystemSettingController(KernelService kernelService) {
        this.kernelService = kernelService;
    }

    @GetMapping
    @SuppressWarnings("unchecked")
    public List<SystemSetting> list() {
        return (List<SystemSetting>) kernelService.execute(SystemPlugin.CODE, "list", Map.of());
    }

    @PutMapping("/{key}")
    public SystemSetting upsert(@PathVariable String key,
                                @RequestBody SettingRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("key", key);
        payload.put("value", request.value());
        payload.put("description", request.description());
        return (SystemSetting) kernelService.execute(
                SystemPlugin.CODE,
                "upsert",
            payload
        );
    }

    public record SettingRequest(String value, String description) {
    }
}
