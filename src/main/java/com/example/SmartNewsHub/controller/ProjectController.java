package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.details.CustomUserDetails;
import com.example.SmartNewsHub.dto.ProjectDTO;
import com.example.SmartNewsHub.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PostMapping("/createProject")
    public ResponseEntity<ProjectDTO> createProject(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody ProjectDTO dto) {
        dto.setCompanyId(customUserDetails.getCompanyId());
        ProjectDTO created = projectService.createProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/getAllProject")
    public ResponseEntity<List<ProjectDTO>> getProjectsByCompany(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        List<ProjectDTO> projects = projectService.getProjectsByCompany(customUserDetails.getCompanyId());
        return ResponseEntity.ok(projects);
    }
}
