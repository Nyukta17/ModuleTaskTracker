package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCompanyId(Long companyId);
}
