package iuh.fit.microkernel.content;

import iuh.fit.microkernel.content.model.ContentItem;
import iuh.fit.microkernel.content.service.ContentService;
import iuh.fit.microkernel.kernel.spi.KernelPlugin;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ContentPlugin implements KernelPlugin {

    public static final String CODE = "content-plugin";
    private final ContentService contentService;

    public ContentPlugin(ContentService contentService) {
        this.contentService = contentService;
    }

    @Override
    public String pluginCode() {
        return CODE;
    }

    @Override
    public String displayName() {
        return "Content Management Plugin";
    }

    @Override
    public String description() {
        return "Create, update, publish and remove CMS content";
    }

    @Override
    public boolean supports(String operation) {
        return switch (operation) {
            case "list", "detail", "create", "update", "publish", "delete" -> true;
            default -> false;
        };
    }

    @Override
    public Object execute(String operation, Map<String, Object> payload) {
        return switch (operation) {
            case "list" -> contentService.listAll();
            case "detail" -> contentService.findById(requiredString(payload, "id"));
            case "create" -> contentService.create(required(payload, "item", ContentItem.class));
            case "update" -> contentService.update(
                    requiredString(payload, "id"),
                    required(payload, "item", ContentItem.class)
            );
            case "publish" -> contentService.publish(
                    requiredString(payload, "id"),
                    (String) payload.getOrDefault("actor", "system")
            );
            case "delete" -> {
                contentService.delete(requiredString(payload, "id"));
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
