package iuh.fit.microkernel.kernel.repository;

import iuh.fit.microkernel.kernel.model.PluginDescriptor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PluginDescriptorRepository extends MongoRepository<PluginDescriptor, String> {
    Optional<PluginDescriptor> findByPluginCode(String pluginCode);
}
