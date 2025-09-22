package com.example.SmartNewsHub.DTO;
import com.example.SmartNewsHub.Enum.TaskPriority;
import com.example.SmartNewsHub.Enum.TaskStatus;
import com.example.SmartNewsHub.model.Company;
import com.example.SmartNewsHub.model.Company_Module;
import com.example.SmartNewsHub.model.Employee;

import java.time.LocalDateTime;

public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime dueDate;
    private String assignedEmployee;
    private String createdByEmployee;
    private String createdByManager;
    private Long projectHub;

    public TaskDTO(Long id, String title, String description, TaskStatus status,
                   TaskPriority priority, LocalDateTime createdAt,
                   LocalDateTime updatedAt, LocalDateTime dueDate) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dueDate = dueDate;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public String getAssignedEmployee() {
        return assignedEmployee;
    }

    public void setAssignedEmployee(String assignedEmployee) {
        this.assignedEmployee = assignedEmployee;
    }

    public String getCreatedByEmployee() {
        return createdByEmployee;
    }

    public void setCreatedByEmployee(String createdByEmployee) {
        this.createdByEmployee = createdByEmployee;
    }

    public String getCreatedByManager() {
        return createdByManager;
    }

    public void setCreatedByManager(String createdByManager) {
        this.createdByManager = createdByManager;
    }

    public Long getProjectHub() {
        return projectHub;
    }

    public void setProjectHub(Long projectHub) {
        this.projectHub = projectHub;
    }
    @Override
    public String toString() {
        return "TaskDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", priority=" + priority +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", dueDate=" + dueDate +
                ", assignedEmployee=" + assignedEmployee +
                ", createdByEmployee=" + createdByEmployee +
                ", createdByManager=" + createdByManager +
                ", projectHub=" + projectHub +
                '}';
    }
}
