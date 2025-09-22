package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.DTO.TaskDTO;
import com.example.SmartNewsHub.DTO.TaskWithAssigneeDTO;
import com.example.SmartNewsHub.Enum.TaskStatus;
import com.example.SmartNewsHub.model.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    @Query("SELECT new com.example.SmartNewsHub.DTO.TaskWithAssigneeDTO(" +
            "t.id, t.title, t.description, t.status, t.priority, " +
            "t.createdAt, t.updatedAt, t.dueDate, " +
            "CONCAT(ae.firstName, ' ', ae.lastName)) " +
            "FROM Task t LEFT JOIN t.assignedEmployee ae " +
            "WHERE t.projectHub.id = :projectHubId")
    List<TaskWithAssigneeDTO> findByProjectHub_Id(@Param("projectHubId") Long projectHubId);




    @Modifying
    @Transactional
    @Query("UPDATE Task t SET t.status = :status WHERE t.id = :taskId")
    int updateStatusById(@Param("taskId") Long taskId, @Param("status") TaskStatus status);

//    @Query("SELECT new com.example.SmartNewsHub.DTO.TaskDTO(" +
//            "t.id, t.title, t.description, t.status, t.priority, " +
//            "t.createdAt, t.updatedAt, t.dueDate, " +
//            "CONCAT(ae.firstName, ' ', ae.lastName)) " +
//            "FROM Task t " +
//            "LEFT JOIN t.assignedEmployee ae " +
//            "WHERE ae.id = :userId")
//    List<TaskDTO> findTasksByAssignedUserId(@Param("userId") Long userId);

    @Query("SELECT new com.example.SmartNewsHub.DTO.TaskDTO(" +
            "t.id, t.title, t.description, t.status, t.priority, " +
            "t.createdAt, t.updatedAt, t.dueDate) " +
            "FROM Task t " +
            "WHERE t.createdByManager.id = :companyId")
    List<TaskDTO> findTasksByCreatedByManagerId(@Param("companyId") Long companyId);





}
