package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.ProjectModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectModuleRepository extends JpaRepository<ProjectModule, Long> {
    List<ProjectModule> findByProjectId(Long projectId);
}