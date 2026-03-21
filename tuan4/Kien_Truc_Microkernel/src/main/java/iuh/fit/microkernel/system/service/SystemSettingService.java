package iuh.fit.microkernel.system.service;

import iuh.fit.microkernel.system.model.SystemSetting;

import java.util.List;

public interface SystemSettingService {
    List<SystemSetting> listAll();

    SystemSetting upsert(String key, String value, String description);
}
