package com.example.ModuleTaskMenadger.dto;

import com.example.ModuleTaskMenadger.Enum.TaskStatus;
import java.time.LocalDateTime;

public class TaskDTO {
    private Long id;
    private Long companyId;
    private Long assignedUserId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private boolean completed;
    private LocalDateTime createdAt;
    private TaskStatus status;

    public TaskDTO() {
    }

    @Override
    public String toString() {
        return "TaskDTO{" +
                "id=" + id +
                ", companyId=" + companyId +
                ", assignedUserId=" + assignedUserId +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", dueDate=" + dueDate +
                ", completed=" + completed +
                ", createdAt=" + createdAt +
                ", status=" + status +
                '}';
    }
// Геттеры и сеттеры всех полей

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
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

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
