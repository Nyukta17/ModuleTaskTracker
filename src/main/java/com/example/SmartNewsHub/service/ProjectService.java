package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.dto.ModuleDTO;
import com.example.SmartNewsHub.dto.ProjectDTO;
import com.example.SmartNewsHub.model.Company;
import com.example.SmartNewsHub.model.Project;
import com.example.SmartNewsHub.model.ProjectModule;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.ModuleRepository;
import com.example.SmartNewsHub.repository.ProjectModuleRepository;
import com.example.SmartNewsHub.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.SmartNewsHub.model.Module;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectService {


    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);
    private ProjectRepository projectRepository;

    private CompanyRepository companyRepository;

    private ModuleRepository moduleRepository;
    private ProjectModuleRepository projectModuleRepository;

    @Autowired
    public ProjectService(ProjectModuleRepository projectModuleRepository,ModuleRepository moduleRepository,ProjectRepository projectRepository,CompanyRepository companyRepository ){
        this.companyRepository=companyRepository;
        this.projectRepository =projectRepository;
        this.moduleRepository = moduleRepository;
        this.projectModuleRepository = projectModuleRepository;

    }

    @Transactional
    public ProjectDTO createProject(ProjectDTO dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id " + dto.getCompanyId()));

        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setCompany(company);

        Project savedProject = projectRepository.save(project);

        // Находим модули из базы

        List<Module> modules = moduleRepository.findByNameIn(dto.getModules());

        // Создаем связки ProjectModule
        List<ProjectModule> projectModules = modules.stream()
                .map(module -> {
                    ProjectModule pm = new ProjectModule();
                    pm.setProject(savedProject);
                    pm.setModule(module);
                    return pm;
                })
                .collect(Collectors.toList());

        // Сохраняем связи
        projectModuleRepository.saveAll(projectModules);

        // При необходимости установить список projectModules в savedProject и сохранить снова
        savedProject.setProjectModules(projectModules);
        projectRepository.save(savedProject);

        return toDTO(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByCompany(Long companyId) {
        List<Project> projects = projectRepository.findByCompanyId(companyId);
        return projects.stream().map(this::toDTO).collect(Collectors.toList());
    }
    public List<ModuleDTO> getModuleById(Long id){
        Set<Module> modules = projectModuleRepository.findDistinctModulesByProjectId(id);
        return modules.stream()
                .map(this::moduleDTO)
                .collect(Collectors.toList());
    }

    private ProjectDTO toDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCompanyId(project.getCompany().getId());
        return dto;
    }
    private ModuleDTO moduleDTO(Module module){
        ModuleDTO dto = new ModuleDTO();
        dto.setName(module.getName());
        return dto;
    };
}
