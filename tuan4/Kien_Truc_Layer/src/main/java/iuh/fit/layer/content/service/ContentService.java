package iuh.fit.layer.content.service;

import iuh.fit.layer.content.model.ContentItem;

import java.util.List;

public interface ContentService {
    List<ContentItem> findAll();

    ContentItem findById(String id);

    ContentItem create(ContentItem contentItem);

    ContentItem update(String id, ContentItem contentItem);

    ContentItem publish(String id, String actor);

    void delete(String id);
}
