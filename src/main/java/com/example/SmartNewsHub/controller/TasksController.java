package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.StatusDTO;
import com.example.SmartNewsHub.DTO.TaskDTO;
import com.example.SmartNewsHub.DTO.TaskWithAssigneeDTO;
import com.example.SmartNewsHub.Enum.TaskStatus;
import com.example.SmartNewsHub.service.JWTservice;
import com.example.SmartNewsHub.service.TasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TasksController {
    private JWTservice jwTservice;
    private TasksService tasksService;
    @Autowired
    public TasksController(JWTservice jwTservice,TasksService tasksService){
        this.jwTservice=jwTservice;
        this.tasksService = tasksService;
    }
    @PostMapping("/createTask")
    public ResponseEntity<String> createTasks(@RequestHeader("Authorization") String authHeader, @RequestBody TaskDTO dto){
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwTservice.validateToken(token)) {
                if(jwTservice.getRole(token).equals("Boss")) {
                    dto.setId(jwTservice.getId(token));
                    dto.setProjectHub(dto.getId());
                    dto.setCreatedByManager("Boss");
                    dto.setCreatedAt(LocalDateTime.now());
                    dto.setUpdatedAt(LocalDateTime.now());
                    this.tasksService.createTask(dto);
                }
                return ResponseEntity.ok("Настройки сохранены");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или отсутствующий токен");
    }
    @GetMapping("getTasks/{projectHubId}")
    public ResponseEntity<?> getAllTask(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("projectHubId") Long projectHubId) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwTservice.validateToken(token)) {
                List<TaskWithAssigneeDTO> tasks = tasksService.getAllTasks(projectHubId);
                return ResponseEntity.ok(tasks);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или отсутствующий токен");
    }

    @PutMapping("/{id_task}/statusUpdate")
    public ResponseEntity<String> updateStatusTask(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("id_task") Long id_task,
            @RequestBody StatusDTO statusDTO) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Отсутствует или неверный токен");
        }

        String token = authHeader.substring(7);
        if (!jwTservice.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или просроченный токен");
        }

        TaskStatus status = statusDTO.getStatus();
        String result = tasksService.updateStatusTask(id_task, status);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/my-tasks")
    public ResponseEntity<?> getEmployeeTasks(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("companyId") Long companyId,
            @RequestParam("hubId") Long hubId) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Отсутствует или неверный токен");
        }

        String token = authHeader.substring(7);

        if (!jwTservice.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или просроченный токен");
        }

        List<TaskDTO> tasks = tasksService.findTasksByUserId(companyId, hubId);

        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/employee-tasks")
    public ResponseEntity<?> getMyTasks(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("userId") Long userId,
            @RequestParam("hubId") Long hubId) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Отсутствует или неверный токен");
        }

        String token = authHeader.substring(7);

        if (!jwTservice.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или просроченный токен");
        }

        List<TaskWithAssigneeDTO> tasks = tasksService.findTasksByUserIdEm(userId, hubId);

        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tasks);
    }


}
