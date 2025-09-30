package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.dto.ProjectDTO;
import com.example.SmartNewsHub.model.Company;
import com.example.SmartNewsHub.model.Project;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.ProjectRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {


    private ProjectRepository projectRepository;

    private CompanyRepository companyRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository,CompanyRepository companyRepository ){
        this.companyRepository=companyRepository;
        this.projectRepository =projectRepository;

    }

    @Transactional
    public ProjectDTO createProject(ProjectDTO dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id " + dto.getCompanyId()));

        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setCompany(company);

        Project saved = projectRepository.save(project);

        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByCompany(Long companyId) {
        List<Project> projects = projectRepository.findByCompanyId(companyId);
        return projects.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ProjectDTO toDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCompanyId(project.getCompany().getId());
        return dto;
    }
}
