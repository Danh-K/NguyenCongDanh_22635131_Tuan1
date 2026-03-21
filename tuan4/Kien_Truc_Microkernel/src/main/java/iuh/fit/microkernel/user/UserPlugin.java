package iuh.fit.microkernel.user;

import iuh.fit.microkernel.kernel.spi.KernelPlugin;
import iuh.fit.microkernel.user.model.SystemUser;
import iuh.fit.microkernel.user.service.UserService;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class UserPlugin implements KernelPlugin {

    public static final String CODE = "user-plugin";
    private final UserService userService;

    public UserPlugin(UserService userService) {
        this.userService = userService;
    }

    @Override
    public String pluginCode() {
        return CODE;
    }

    @Override
    public String displayName() {
        return "User Management Plugin";
    }

    @Override
    public String description() {
        return "Manage system users and activation states";
    }

    @Override
    public boolean supports(String operation) {
        return switch (operation) {
            case "list", "detail", "create", "update", "delete" -> true;
            default -> false;
        };
    }

    @Override
    public Object execute(String operation, Map<String, Object> payload) {
        return switch (operation) {
            case "list" -> userService.listAll();
            case "detail" -> userService.findById(requiredString(payload, "id"));
            case "create" -> userService.create(required(payload, "user", SystemUser.class));
            case "update" -> userService.update(
                    requiredString(payload, "id"),
                    required(payload, "user", SystemUser.class)
            );
            case "delete" -> {
                userService.delete(requiredString(payload, "id"));
                yield null;
            }
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

    private <T> T required(Map<String, Object> payload, String key, Class<T> type) {
        Object value = payload.get(key);
        if (value == null) {
            throw new IllegalArgumentException("Missing required field: " + key);
        }
        if (!type.isInstance(value)) {
            throw new IllegalArgumentException("Invalid type for field " + key + ": " + value.getClass().getSimpleName());
        }
        return type.cast(value);
    }
}
