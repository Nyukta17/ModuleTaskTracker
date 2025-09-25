package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.TaskDTO;
import com.example.SmartNewsHub.DTO.TaskWithAssigneeDTO;
import com.example.SmartNewsHub.Enum.TaskStatus;
import com.example.SmartNewsHub.model.Task;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.EmployeeRepository;
import com.example.SmartNewsHub.repository.ModulesRepository;
import com.example.SmartNewsHub.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TasksService {
    EmployeeRepository employeeRepository;
    CompanyRepository companyRepository;
    ModulesRepository modulesRepository;
    TaskRepository taskRepository;
    @Autowired
    TasksService(EmployeeRepository employeeRepository, CompanyRepository companyRepository, ModulesRepository modulesRepository,TaskRepository taskRepository){
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.modulesRepository = modulesRepository;
        this.taskRepository = taskRepository;
    }
    public void createTask(TaskDTO dto){

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setCreatedAt(dto.getCreatedAt());
        task.setUpdatedAt(dto.getUpdatedAt());
        task.setDueDate(dto.getDueDate());
        task.setAssignedUser(employeeRepository.findByLastName(dto
                .getAssignedEmployee()).get(0));
        task.setCreatedByManager(companyRepository.findById(dto.getId()).get());
        task.setProjectHub(modulesRepository.findByCompanyId(dto.getId()).get(0));
        taskRepository.save(task);
    };
    public List<TaskWithAssigneeDTO> getAllTasks(Long projectHubId){
        return taskRepository.findByProjectHub_Id(projectHubId);
    }
    @Transactional
    public String updateStatusTask(Long id, TaskStatus status) {
        int updatedCount = taskRepository.updateStatusById(id, status);
        return updatedCount > 0 ? "OK" : "Задача не найдена";
    }
    public List<TaskDTO> findTasksByUserId(Long userId,Long Hub) {

      return taskRepository.findTasksByCreatedByManagerIdAndProjectHubId(userId,Hub);

    }
    public List<TaskWithAssigneeDTO> findTasksByUserIdEm(Long userId,Long projectId) {

        return taskRepository.findTasksByAssignedUserIdAndProjectHubId(userId,projectId);

    }
}
