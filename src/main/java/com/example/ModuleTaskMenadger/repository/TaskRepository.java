package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task,Long> {

}
