package com.example.SmartNewsHub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_event")
public class CalendarEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Column
    private LocalDateTime endDateTime;

    @OneToOne
    @JoinColumn(name = "task_id", unique = true)
    private Task task;  // связь с задачей

    @CreationTimestamp
    private LocalDateTime createdAt;

    // геттеры и сеттеры
}

