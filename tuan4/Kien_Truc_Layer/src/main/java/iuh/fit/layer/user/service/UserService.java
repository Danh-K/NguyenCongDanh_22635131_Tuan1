package iuh.fit.layer.user.service;

import iuh.fit.layer.user.model.SystemUser;

import java.util.List;

public interface UserService {
    List<SystemUser> listAll();

    SystemUser findById(String id);

    SystemUser create(SystemUser user);

    SystemUser update(String id, SystemUser user);

    void delete(String id);
}
