package iuh.fit.microkernel.system.repository;

import iuh.fit.microkernel.system.model.SystemSetting;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SystemSettingRepository extends MongoRepository<SystemSetting, String> {
    Optional<SystemSetting> findBySettingKey(String settingKey);
}
