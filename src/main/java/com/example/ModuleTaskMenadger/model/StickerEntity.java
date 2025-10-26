package com.example.ModuleTaskMenadger.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stickers")
public class StickerEntity {

    @Id
    private Long id;

    @ManyToOne()
    @JoinColumn(name="user_id")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private Integer x;

    @Column(nullable = false)
    private Integer y;

    @Column(nullable = false)
    private Boolean isEditing;

    @Column(nullable = false)
    private Boolean done;

    public StickerEntity() {}

    public Users getUsers() {
        return users;
    }

    public Project getProject() {
        return project;
    }

    public Boolean getEditing() {
        return isEditing;
    }

    public void setEditing(Boolean editing) {
        isEditing = editing;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

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

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Boolean getIsEditing() {
        return isEditing;
    }

    public void setIsEditing(Boolean isEditing) {
        this.isEditing = isEditing;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }
}
