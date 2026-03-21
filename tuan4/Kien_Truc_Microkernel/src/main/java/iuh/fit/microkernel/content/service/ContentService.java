package iuh.fit.microkernel.content.service;

import iuh.fit.microkernel.content.model.ContentItem;

import java.util.List;

public interface ContentService {
    List<ContentItem> listAll();

    ContentItem findById(String id);

    ContentItem create(ContentItem item);

    ContentItem update(String id, ContentItem item);

    ContentItem publish(String id, String actor);

    void delete(String id);
}
