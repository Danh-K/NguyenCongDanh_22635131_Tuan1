package iuh.fit.microkernel.user.repository;

import iuh.fit.microkernel.user.model.SystemUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SystemUserRepository extends MongoRepository<SystemUser, String> {
}
