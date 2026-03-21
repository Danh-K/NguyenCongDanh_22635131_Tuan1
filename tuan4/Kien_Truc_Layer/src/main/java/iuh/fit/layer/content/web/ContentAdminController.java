package iuh.fit.layer.content.web;

import iuh.fit.layer.content.model.ContentItem;
import iuh.fit.layer.content.service.ContentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contents")
public class ContentAdminController {

    private final ContentService contentService;

    public ContentAdminController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public List<ContentItem> list() {
        return contentService.findAll();
    }

    @GetMapping("/{id}")
    public ContentItem detail(@PathVariable String id) {
        return contentService.findById(id);
    }

    @PostMapping
    public ContentItem create(@RequestBody ContentItem contentItem) {
        return contentService.create(contentItem);
    }

    @PutMapping("/{id}")
    public ContentItem update(@PathVariable String id, @RequestBody ContentItem contentItem) {
        return contentService.update(id, contentItem);
    }

    @PatchMapping("/{id}/publish")
    public ContentItem publish(@PathVariable String id,
                               @RequestParam(defaultValue = "system") String actor) {
        return contentService.publish(id, actor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        contentService.delete(id);
    }
}
