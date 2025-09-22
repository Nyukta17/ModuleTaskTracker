package com.example.SmartNewsHub.model;

import com.example.SmartNewsHub.Enum.TaskPriority;
import com.example.SmartNewsHub.Enum.TaskStatus;
import jakarta.persistence.*;
import org.apache.catalina.User;

import java.time.LocalDateTime;

@Entity
@Table(name="Tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime dueDate;

    @ManyToOne
    @JoinColumn(name = "assigned_employee_id")
    private Employee
            assignedEmployee;

    // Создатель – обычный пользователь
    @ManyToOne
    @JoinColumn(name = "created_by_employee_id")
    private Employee createdByEmployee;

    // Создатель – руководитель
    @ManyToOne
    @JoinColumn(name = "created_by_company_id")
    private Company createdByManager;

    @ManyToOne
    @JoinColumn(name = "project_hub_id", nullable = false)
    private Company_Module projectHub;

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

    public Employee getAssignedUser() {
        return assignedEmployee;
    }

    public void setAssignedUser(Employee assignedEmployee) {
        this.assignedEmployee = assignedEmployee;
    }

    public Employee getCreatedByUser() {
        return createdByEmployee;
    }

    public void setCreatedByUser(Employee createdByEmployee) {
        this.createdByEmployee = createdByEmployee;
    }

    public Company getCreatedByManager() {
        return createdByManager;
    }

    public void setCreatedByManager(Company createdByManager) {
        this.createdByManager = createdByManager;
    }

    public Company_Module getProjectHub() {
        return projectHub;
    }

    public void setProjectHub(Company_Module projectHub) {
        this.projectHub = projectHub;
    }
}
