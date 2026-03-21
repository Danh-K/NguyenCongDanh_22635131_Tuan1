package iuh.fit.microkernel.content.repository;

import iuh.fit.microkernel.content.model.ContentItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContentRepository extends MongoRepository<ContentItem, String> {
}
