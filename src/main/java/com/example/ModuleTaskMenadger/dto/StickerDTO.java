package com.example.ModuleTaskMenadger.dto;

public class StickerDTO {
    private Long id;
    private String text;
    private Integer x;
    private Integer y;
    private Boolean isEditing;
    private Boolean done;
    private Long userId;    // для связи с пользователем
    private Long projectId; // для связи с проектом (hub)

    public StickerDTO() {}

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
