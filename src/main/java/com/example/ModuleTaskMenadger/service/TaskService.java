package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.TaskDTO;
import com.example.ModuleTaskMenadger.model.Task;
import com.example.ModuleTaskMenadger.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Получить все задачи
    public List<TaskDTO> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        System.out.println(tasks);
        return tasks.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // Получить задачу по ID
    public Optional<TaskDTO> getTaskById(Long id) {
        return taskRepository.findById(id).map(this::convertToDto);
    }

    // Создать задачу
    public TaskDTO createTask(TaskDTO dto) {
        Task task = convertToEntity(dto);
        Task saved = taskRepository.save(task);
        return convertToDto(saved);
    }

    // Обновить задачу
    public Optional<TaskDTO> updateTask(Long id, TaskDTO dto) {
        return taskRepository.findById(id).map(existingTask -> {
            existingTask.setTitle(dto.getTitle());
            existingTask.setDescription(dto.getDescription());
            existingTask.setDueDate(dto.getDueDate());
            existingTask.setCompleted(dto.isCompleted());
            // Можно добавить обновление других полей
            Task saved = taskRepository.save(existingTask);
            return convertToDto(saved);
        });
    }

    // Удалить задачу
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Преобразование Entity в DTO
    private TaskDTO convertToDto(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setCompleted(task.isCompleted());
        dto.setStatus(task.getStatus());
        // Другие поля
        return dto;
    }

    // Преобразование DTO в Entity
    private Task convertToEntity(TaskDTO dto) {
        Task task = new Task();
        // При создании id не устанавливаем
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setCompleted(dto.isCompleted());
        // Другие поля
        return task;
    }
}
