package iuh.fit.microkernel.system.service.impl;

import iuh.fit.microkernel.system.model.SystemSetting;
import iuh.fit.microkernel.system.repository.SystemSettingRepository;
import iuh.fit.microkernel.system.service.SystemSettingService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository settingRepository;

    public SystemSettingServiceImpl(SystemSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @Override
    public List<SystemSetting> listAll() {
        return settingRepository.findAll();
    }

    @Override
    public SystemSetting upsert(String key, String value, String description) {
        SystemSetting setting = settingRepository.findBySettingKey(key)
                .orElseGet(SystemSetting::new);
        setting.setSettingKey(key);
        setting.setSettingValue(value);
        setting.setDescription(description);
        setting.setUpdatedAt(Instant.now());
        return settingRepository.save(setting);
    }
}
