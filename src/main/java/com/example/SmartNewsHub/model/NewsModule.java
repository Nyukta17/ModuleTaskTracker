package com.example.SmartNewsHub.model;

import com.example.SmartNewsHub.Enum.NewsType;
import com.example.SmartNewsHub.Enum.TaskStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "news_module")
public class NewsModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2048)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, unique = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;


    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private Employee createdBy;

    public NewsModule() {}

    public NewsModule(String title, String content, java.time.LocalDateTime createdAt, Company company, Employee createdBy) {
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.company = company;
        this.createdBy = createdBy;
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

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Employee getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Employee createdBy) {
        this.createdBy = createdBy;
    }
}
