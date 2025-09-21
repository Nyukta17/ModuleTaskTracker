package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByProjectHub_Id(Long projectHubId);
}
