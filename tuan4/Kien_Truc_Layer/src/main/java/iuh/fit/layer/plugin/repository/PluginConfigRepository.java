package iuh.fit.layer.plugin.repository;

import iuh.fit.layer.plugin.model.PluginConfigEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PluginConfigRepository extends MongoRepository<PluginConfigEntity, String> {
    Optional<PluginConfigEntity> findByPluginCode(String pluginCode);
}
