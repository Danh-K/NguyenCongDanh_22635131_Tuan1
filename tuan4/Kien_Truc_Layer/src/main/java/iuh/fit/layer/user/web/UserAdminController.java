package iuh.fit.layer.user.web;

import iuh.fit.layer.user.model.SystemUser;
import iuh.fit.layer.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserAdminController {

    private final UserService userService;

    public UserAdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<SystemUser> list() {
        return userService.listAll();
    }

    @GetMapping("/{id}")
    public SystemUser detail(@PathVariable String id) {
        return userService.findById(id);
    }

    @PostMapping
    public SystemUser create(@RequestBody SystemUser user) {
        return userService.create(user);
    }

    @PutMapping("/{id}")
    public SystemUser update(@PathVariable String id, @RequestBody SystemUser user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        userService.delete(id);
    }
}
