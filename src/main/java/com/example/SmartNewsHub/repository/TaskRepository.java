package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task,Long> {

}
