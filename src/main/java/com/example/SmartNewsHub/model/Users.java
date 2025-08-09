package com.example.SmartNewsHub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false,unique = true)
    private String nickName;

    @Column(nullable = false)
    private String role;

    @CreationTimestamp
    @Column(nullable = false, unique = false)
    private LocalDateTime createdAt;

    public Users() {
    }

    public Users(String email, String password, String nickName, String role) {
        this.email = email;
        this.password=password;
        this.nickName=nickName;
        this.role = role;
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
    public String getNickName() {
        return nickName;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
