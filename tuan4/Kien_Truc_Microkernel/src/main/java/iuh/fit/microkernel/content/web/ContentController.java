package iuh.fit.microkernel.content.web;

import iuh.fit.microkernel.content.ContentPlugin;
import iuh.fit.microkernel.content.model.ContentItem;
import iuh.fit.microkernel.kernel.service.KernelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mk/content")
public class ContentController {

    private final KernelService kernelService;

    public ContentController(KernelService kernelService) {
        this.kernelService = kernelService;
    }

    @GetMapping
    @SuppressWarnings("unchecked")
    public List<ContentItem> list() {
        return (List<ContentItem>) kernelService.execute(ContentPlugin.CODE, "list", Map.of());
    }

    @GetMapping("/{id}")
    public ContentItem detail(@PathVariable String id) {
        return (ContentItem) kernelService.execute(ContentPlugin.CODE, "detail", Map.of("id", id));
    }

    @PostMapping
    public ContentItem create(@RequestBody ContentItem item) {
        return (ContentItem) kernelService.execute(ContentPlugin.CODE, "create", Map.of("item", item));
    }

    @PutMapping("/{id}")
    public ContentItem update(@PathVariable String id, @RequestBody ContentItem item) {
        return (ContentItem) kernelService.execute(
                ContentPlugin.CODE,
                "update",
                Map.of("id", id, "item", item)
        );
    }

    @PatchMapping("/{id}/publish")
    public ContentItem publish(@PathVariable String id,
                               @RequestParam(defaultValue = "system") String actor) {
        return (ContentItem) kernelService.execute(
                ContentPlugin.CODE,
                "publish",
                Map.of("id", id, "actor", actor)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        kernelService.execute(ContentPlugin.CODE, "delete", Map.of("id", id));
    }
}
