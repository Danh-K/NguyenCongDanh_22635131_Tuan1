package iuh.fit.microkernel.user.web;

import iuh.fit.microkernel.kernel.service.KernelService;
import iuh.fit.microkernel.user.UserPlugin;
import iuh.fit.microkernel.user.model.SystemUser;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mk/users")
public class UserController {

    private final KernelService kernelService;

    public UserController(KernelService kernelService) {
        this.kernelService = kernelService;
    }

    @GetMapping
    @SuppressWarnings("unchecked")
    public List<SystemUser> list() {
        return (List<SystemUser>) kernelService.execute(UserPlugin.CODE, "list", Map.of());
    }

    @GetMapping("/{id}")
    public SystemUser detail(@PathVariable String id) {
        return (SystemUser) kernelService.execute(UserPlugin.CODE, "detail", Map.of("id", id));
    }

    @PostMapping
    public SystemUser create(@RequestBody SystemUser user) {
        return (SystemUser) kernelService.execute(UserPlugin.CODE, "create", Map.of("user", user));
    }

    @PutMapping("/{id}")
    public SystemUser update(@PathVariable String id, @RequestBody SystemUser user) {
        return (SystemUser) kernelService.execute(UserPlugin.CODE, "update", Map.of("id", id, "user", user));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        kernelService.execute(UserPlugin.CODE, "delete", Map.of("id", id));
    }
}
