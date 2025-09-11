package com.example.SmartNewsHub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="EventModule")
public class EventModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String text;

    private LocalDateTime dateTime;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = true)
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
