package com.example.ModuleTaskMenadger.controller;

import com.example.ModuleTaskMenadger.details.CustomUserDetails;
import com.example.ModuleTaskMenadger.dto.TaskDTO;
import com.example.ModuleTaskMenadger.service.CustomUserDetailsService;
import com.example.ModuleTaskMenadger.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.CustomAutowireConfigurer;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Получить все задачи
    @GetMapping("/all")
    public ResponseEntity<List<TaskDTO>> getAllTasks(@AuthenticationPrincipal CustomUserDetails customUserDetails,@RequestParam("hubId")Long hubId) {
        List<TaskDTO> tasks = taskService.getAllTasks(hubId,customUserDetails.getCompanyId());
        return ResponseEntity.ok(tasks);
    }

    // Получить задачу по id
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Создать новую задачу
    @PostMapping("/create")
    public ResponseEntity<TaskDTO> createTask(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody TaskDTO taskDTO, @RequestParam("hubId")Long id) {
        taskDTO.setHub_Id(id);
        taskDTO.setCompanyId(customUserDetails.getCompanyId());
        TaskDTO createdTask = taskService.createTask(taskDTO);
        return ResponseEntity.ok(createdTask);
    }

    // Обновить задачу по id
    @PutMapping("/update/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        return taskService.updateTask(id, taskDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Удалить задачу по id
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
