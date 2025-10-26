package com.example.ModuleTaskMenadger.dto;

public class MarkerDTO {
    private Long id;
    private Integer startHour;
    private Integer durationHours;
    private Integer verticalOffset;
    private String title;

    // Конструкторы
    public MarkerDTO() {}

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getStartHour() { return startHour; }
    public void setStartHour(Integer startHour) { this.startHour = startHour; }

    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }

    public Integer getVerticalOffset() { return verticalOffset; }
    public void setVerticalOffset(Integer verticalOffset) { this.verticalOffset = verticalOffset; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    @Override
    public String toString() {
        return "MarkerDTO{" +
                "id=" + id +
                ", startHour=" + startHour +
                ", durationHours=" + durationHours +
                ", verticalOffset=" + verticalOffset +
                ", title='" + title + '\'' +
                '}';
    }
}
