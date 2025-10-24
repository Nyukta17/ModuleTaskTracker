package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.TaskDTO;
import com.example.ModuleTaskMenadger.model.Task;
import com.example.ModuleTaskMenadger.repository.CompanyRepository;
import com.example.ModuleTaskMenadger.repository.ProjectRepository;
import com.example.ModuleTaskMenadger.repository.TaskRepository;
import com.example.ModuleTaskMenadger.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private UsersRepository usersRepository;
    // Получить все задачи
    public List<TaskDTO> getAllTasks(Long projectId,Long companyId) {
        try {
            List<Task> tasks = taskRepository.findByProjectIdAndCompanyId(projectId, companyId);
            return tasks.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {

            System.err.println("Ошибка при получении задач: " + e.getMessage());

            throw new RuntimeException("Ошибка при получении задач", e);

        }
    }

    // Получить задачу по ID
    public Optional<TaskDTO> getTaskById(Long id) {
        return taskRepository.findById(id).map(this::convertToDto);
    }

    // Создать задачу
    @Transactional
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
            existingTask.setStatus(dto.getStatus());
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
        dto.setAssignedUser(
                usersRepository.findByUsername(task.getAssignedUser().getUsername())
                        .orElseThrow(() -> new RuntimeException("user not found")).getUsername()
        );
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

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setCompleted(dto.isCompleted());
        task.setProject(projectRepository.findById(dto.getHub_Id()).orElseThrow(()-> new RuntimeException("project not found")));
        task.setCompany(companyRepository.findById(dto.getCompanyId()).orElseThrow(()-> new RuntimeException("company not found")));
        task.setAssignedUser(usersRepository.findByUsername(dto.getAssignedUser()).orElseThrow(()->new RuntimeException("user not found")));
        task.setStatus(dto.getStatus());
        // Другие поля
        return task;
    }
}
