package iuh.fit.layer.system.service;

import iuh.fit.layer.system.model.SystemSetting;

import java.util.List;

public interface SystemSettingService {
    List<SystemSetting> listAll();

    SystemSetting upsert(String key, String value, String description);
}
