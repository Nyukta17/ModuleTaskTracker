package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Module;
import com.example.SmartNewsHub.model.ProjectModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ProjectModuleRepository extends JpaRepository<ProjectModule, Long> {
    @Query("SELECT DISTINCT pm.module FROM ProjectModule pm WHERE pm.project.id = :projectId")
    Set<Module> findDistinctModulesByProjectId(@Param("projectId") Long projectId);
}
