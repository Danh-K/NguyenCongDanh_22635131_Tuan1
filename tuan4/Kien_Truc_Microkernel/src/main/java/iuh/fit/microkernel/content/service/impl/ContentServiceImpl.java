package iuh.fit.microkernel.content.service.impl;

import iuh.fit.microkernel.content.model.ContentItem;
import iuh.fit.microkernel.content.model.ContentStatus;
import iuh.fit.microkernel.content.repository.ContentRepository;
import iuh.fit.microkernel.content.service.ContentService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ContentServiceImpl implements ContentService {

    private final ContentRepository contentRepository;

    public ContentServiceImpl(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @Override
    public List<ContentItem> listAll() {
        return contentRepository.findAll();
    }

    @Override
    public ContentItem findById(String id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content not found: " + id));
    }

    @Override
    public ContentItem create(ContentItem item) {
        Instant now = Instant.now();
        item.setCreatedAt(now);
        item.setUpdatedAt(now);
        item.setStatus(ContentStatus.DRAFT);
        return contentRepository.save(item);
    }

    @Override
    public ContentItem update(String id, ContentItem item) {
        ContentItem existing = findById(id);
        existing.setTitle(item.getTitle());
        existing.setBody(item.getBody());
        existing.setType(item.getType());
        existing.setTags(item.getTags());
        existing.setLastModifiedBy(item.getLastModifiedBy());
        existing.setUpdatedAt(Instant.now());
        return contentRepository.save(existing);
    }

    @Override
    public ContentItem publish(String id, String actor) {
        ContentItem existing = findById(id);
        existing.setStatus(ContentStatus.PUBLISHED);
        existing.setPublishedAt(Instant.now());
        existing.setLastModifiedBy(actor);
        existing.setUpdatedAt(Instant.now());
        return contentRepository.save(existing);
    }

    @Override
    public void delete(String id) {
        if (!contentRepository.existsById(id)) {
            throw new IllegalArgumentException("Content not found: " + id);
        }
        contentRepository.deleteById(id);
    }
}
