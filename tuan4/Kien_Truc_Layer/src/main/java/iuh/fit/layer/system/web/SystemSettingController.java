package iuh.fit.layer.system.web;

import iuh.fit.layer.system.model.SystemSetting;
import iuh.fit.layer.system.service.SystemSettingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @GetMapping
    public List<SystemSetting> list() {
        return systemSettingService.listAll();
    }

    @PutMapping("/{key}")
    public SystemSetting upsert(@PathVariable String key,
                                @RequestBody SettingRequest request) {
        return systemSettingService.upsert(key, request.value(), request.description());
    }

    public record SettingRequest(String value, String description) {
    }
}
