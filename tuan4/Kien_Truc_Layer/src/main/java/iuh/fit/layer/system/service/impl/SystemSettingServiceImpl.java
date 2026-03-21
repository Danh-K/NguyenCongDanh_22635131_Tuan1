package iuh.fit.layer.system.service.impl;

import iuh.fit.layer.system.model.SystemSetting;
import iuh.fit.layer.system.repository.SystemSettingRepository;
import iuh.fit.layer.system.service.SystemSettingService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;

    public SystemSettingServiceImpl(SystemSettingRepository systemSettingRepository) {
        this.systemSettingRepository = systemSettingRepository;
    }

    @Override
    public List<SystemSetting> listAll() {
        return systemSettingRepository.findAll();
    }

    @Override
    public SystemSetting upsert(String key, String value, String description) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(key)
                .orElseGet(SystemSetting::new);
        setting.setSettingKey(key);
        setting.setSettingValue(value);
        setting.setDescription(description);
        setting.setUpdatedAt(Instant.now());
        return systemSettingRepository.save(setting);
    }
}
