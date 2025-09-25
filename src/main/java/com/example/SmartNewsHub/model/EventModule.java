package com.example.SmartNewsHub.model;

import com.example.SmartNewsHub.Enum.NewsType;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="EventModule")
public class EventModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String text;

    @Enumerated(EnumType.STRING)
    private NewsType type;

    private LocalDate dateTime;

    private String startTime; // формат "HH:mm"
    private String endTime;   // формат "HH:mm"


    @ManyToOne
    @JoinColumn(name="user_id", nullable = true)
    private Employee employee;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NewsType getType() {
        return type;
    }


    public void setType(NewsType type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDate getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDate dateTime) {
        this.dateTime = dateTime;
    }

    public Employee getUser() {
        return employee;
    }

    public void setUser(Employee employee) {
        this.employee = employee;
    }
}
