package iuh.fit.microkernel.user.service.impl;

import iuh.fit.microkernel.user.model.SystemUser;
import iuh.fit.microkernel.user.repository.SystemUserRepository;
import iuh.fit.microkernel.user.service.UserService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final SystemUserRepository userRepository;

    public UserServiceImpl(SystemUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<SystemUser> listAll() {
        return userRepository.findAll();
    }

    @Override
    public SystemUser findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    @Override
    public SystemUser create(SystemUser user) {
        Instant now = Instant.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return userRepository.save(user);
    }

    @Override
    public SystemUser update(String id, SystemUser user) {
        SystemUser existing = findById(id);
        existing.setUsername(user.getUsername());
        existing.setEmail(user.getEmail());
        existing.setRole(user.getRole());
        existing.setActive(user.isActive());
        existing.setUpdatedAt(Instant.now());
        return userRepository.save(existing);
    }

    @Override
    public void delete(String id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }
}
