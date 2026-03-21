package iuh.fit.layer.content.repository;

import iuh.fit.layer.content.model.ContentItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContentRepository extends MongoRepository<ContentItem, String> {
}
