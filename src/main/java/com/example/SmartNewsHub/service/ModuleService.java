package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.dto.ModuleDTO;
import com.example.SmartNewsHub.model.Module;
import com.example.SmartNewsHub.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Transactional
    public ModuleDTO createModule(ModuleDTO dto) {
        if (moduleRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Module with this name already exists");
        }

        Module module = new Module();
        module.setName(dto.getName());

        Module saved = moduleRepository.save(module);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ModuleDTO getModuleById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Module not found with id " + id));
        return toDTO(module);
    }

    @Transactional
    public ModuleDTO updateModule(Long id, ModuleDTO dto) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Module not found with id " + id));

        if (!module.getName().equals(dto.getName()) && moduleRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Module with this name already exists");
        }

        module.setName(dto.getName());

        Module updated = moduleRepository.save(module);
        return toDTO(updated);
    }

    @Transactional
    public void deleteModule(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new IllegalArgumentException("Module not found with id " + id);
        }
        moduleRepository.deleteById(id);
    }

    private ModuleDTO toDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setName(module.getName());
        return dto;
    }
}
