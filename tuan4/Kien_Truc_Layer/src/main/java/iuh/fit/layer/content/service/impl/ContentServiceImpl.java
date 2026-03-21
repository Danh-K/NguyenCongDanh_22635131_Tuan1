package iuh.fit.layer.content.service.impl;

import iuh.fit.layer.content.model.ContentItem;
import iuh.fit.layer.content.model.ContentStatus;
import iuh.fit.layer.content.repository.ContentRepository;
import iuh.fit.layer.content.service.ContentService;
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
    public List<ContentItem> findAll() {
        return contentRepository.findAll();
    }

    @Override
    public ContentItem findById(String id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content not found: " + id));
    }

    @Override
    public ContentItem create(ContentItem contentItem) {
        Instant now = Instant.now();
        contentItem.setCreatedAt(now);
        contentItem.setUpdatedAt(now);
        contentItem.setStatus(ContentStatus.DRAFT);
        return contentRepository.save(contentItem);
    }

    @Override
    public ContentItem update(String id, ContentItem contentItem) {
        ContentItem existing = findById(id);
        existing.setTitle(contentItem.getTitle());
        existing.setBody(contentItem.getBody());
        existing.setType(contentItem.getType());
        existing.setTags(contentItem.getTags());
        existing.setLastModifiedBy(contentItem.getLastModifiedBy());
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
