package com.example.SmartNewsHub.DTO;

public class NewsModuleDTO {

    private Long id;
    private String title;
    private String content;
    private java.time.LocalDateTime createdAt;
    private Long companyId;
    private Long createdByUserId;

    public NewsModuleDTO() {}

    public NewsModuleDTO(Long id, String title, String content, java.time.LocalDateTime createdAt, Long companyId, Long createdByUserId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.companyId = companyId;
        this.createdByUserId = createdByUserId;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }
}

