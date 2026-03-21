package iuh.fit.microkernel.system;

import iuh.fit.microkernel.kernel.spi.KernelPlugin;
import iuh.fit.microkernel.system.service.SystemSettingService;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SystemPlugin implements KernelPlugin {

    public static final String CODE = "system-plugin";
    private final SystemSettingService systemSettingService;

    public SystemPlugin(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @Override
    public String pluginCode() {
        return CODE;
    }

    @Override
    public String displayName() {
        return "System Setting Plugin";
    }

    @Override
    public String description() {
        return "Manage runtime system settings and feature flags";
    }

    @Override
    public boolean supports(String operation) {
        return switch (operation) {
            case "list", "upsert" -> true;
            default -> false;
        };
    }

    @Override
    public Object execute(String operation, Map<String, Object> payload) {
        return switch (operation) {
            case "list" -> systemSettingService.listAll();
            case "upsert" -> systemSettingService.upsert(
                    requiredString(payload, "key"),
                    requiredString(payload, "value"),
                    (String) payload.get("description")
            );
            default -> throw new IllegalArgumentException("Unsupported operation: " + operation);
        };
    }

    private String requiredString(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        if (value == null || value.toString().isBlank()) {
            throw new IllegalArgumentException("Missing required field: " + key);
        }
        return value.toString();
    }
}
