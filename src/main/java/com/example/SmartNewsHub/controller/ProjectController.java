package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.dto.ProjectDTO;
import com.example.SmartNewsHub.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private ProjectService projectService;
    @Autowired
    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO dto) {
        ProjectDTO created = projectService.createProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByCompany(@PathVariable Long companyId) {
        List<ProjectDTO> projects = projectService.getProjectsByCompany(companyId);
        return ResponseEntity.ok(projects);
    }
}
