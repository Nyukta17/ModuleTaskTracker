package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.TaskDTO;
import com.example.SmartNewsHub.service.JWTservice;
import com.example.SmartNewsHub.service.TasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                this.tasksService.createTask(dto);
                return ResponseEntity.ok("Настройки сохранены");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или отсутствующий токен");
    }

}
