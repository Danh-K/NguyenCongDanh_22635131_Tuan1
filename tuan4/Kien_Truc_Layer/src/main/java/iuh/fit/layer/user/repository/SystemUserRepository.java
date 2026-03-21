package iuh.fit.layer.user.repository;

import iuh.fit.layer.user.model.SystemUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SystemUserRepository extends MongoRepository<SystemUser, String> {
}
