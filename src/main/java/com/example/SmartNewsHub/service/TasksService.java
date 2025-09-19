package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.TaskDTO;
import org.springframework.stereotype.Service;

@Service
public class TasksService {
    public void createTask(TaskDTO dto){
        System.out.println(dto.toString());
    };
}
