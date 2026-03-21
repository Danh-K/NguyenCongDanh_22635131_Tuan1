package iuh.fit.layer.user.service.impl;

import iuh.fit.layer.user.model.SystemUser;
import iuh.fit.layer.user.repository.SystemUserRepository;
import iuh.fit.layer.user.service.UserService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final SystemUserRepository systemUserRepository;

    public UserServiceImpl(SystemUserRepository systemUserRepository) {
        this.systemUserRepository = systemUserRepository;
    }

    @Override
    public List<SystemUser> listAll() {
        return systemUserRepository.findAll();
    }

    @Override
    public SystemUser findById(String id) {
        return systemUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    @Override
    public SystemUser create(SystemUser user) {
        Instant now = Instant.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return systemUserRepository.save(user);
    }

    @Override
    public SystemUser update(String id, SystemUser user) {
        SystemUser existing = findById(id);
        existing.setUsername(user.getUsername());
        existing.setEmail(user.getEmail());
        existing.setRole(user.getRole());
        existing.setActive(user.isActive());
        existing.setUpdatedAt(Instant.now());
        return systemUserRepository.save(existing);
    }

    @Override
    public void delete(String id) {
        if (!systemUserRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found: " + id);
        }
        systemUserRepository.deleteById(id);
    }
}
