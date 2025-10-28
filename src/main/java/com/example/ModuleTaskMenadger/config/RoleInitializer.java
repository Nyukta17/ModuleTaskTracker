package com.example.ModuleTaskMenadger.config;
import com.example.ModuleTaskMenadger.model.Role;
import com.example.ModuleTaskMenadger.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class RoleInitializer {

    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    @Transactional
    public void initRoles() {
        List<String> requiredRoles = List.of("ADMIN", "USER", "MANAGER", "DEVELOPER", "QA");

        for (String roleName : requiredRoles) {
            if (!roleRepository.existsByName(roleName)) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }
    }
}
