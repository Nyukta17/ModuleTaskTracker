package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    int countTasksByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT t.status as status, COUNT(t) as count FROM Task t WHERE t.project.id = :projectId GROUP BY t.status")
    List<Object[]> countTasksGroupedByStatus(@Param("projectId") Long projectId);
    List<Task> findByProjectIdAndCompanyIdAndCompletedFalse(Long projectId, Long companyId);

    List<Task> findByProjectIdAndAssignedUsers_IdAndCompletedFalse(Long projectId, Long userId);

}
