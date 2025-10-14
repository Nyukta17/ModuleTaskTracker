package com.example.ModuleTaskMenadger.dto;

import java.time.LocalDateTime;

public class NewsDTO {
    private Long id;
    private Long companyId;
    private String title;
    private String content;
    private LocalDateTime createdAt;

    public NewsDTO() {
    }

    public NewsDTO(Long id, Long companyId, String title, String content, LocalDateTime createdAt) {
        this.id = id;
        this.companyId = companyId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Геттеры и сеттеры

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
