package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByProjectIdAndCompanyId(Long projectId, Long companyId);
}
