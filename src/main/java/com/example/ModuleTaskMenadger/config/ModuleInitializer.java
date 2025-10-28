package com.example.ModuleTaskMenadger.config;

import com.example.ModuleTaskMenadger.model.Module;
import com.example.ModuleTaskMenadger.repository.ModuleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class ModuleInitializer {

    private final ModuleRepository moduleRepository;

    public ModuleInitializer(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    @PostConstruct
    @Transactional
    public void initializeModules() {
        List<String> modules = List.of(
                "NEWS",
                "CALENDAR",
                "ANALYTICS",
                "TIME_TRACKER",
                "BASE_MODULE"
        );
        for (String moduleName : modules) {
            if (!moduleRepository.existsByName(moduleName)) {
                Module module = new Module();
                module.setName(moduleName);
                moduleRepository.save(module);
            }
        }
    }
}
