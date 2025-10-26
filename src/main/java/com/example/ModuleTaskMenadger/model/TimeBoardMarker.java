package com.example.ModuleTaskMenadger.model;
import jakarta.persistence.*;

@Entity
@Table(name = "time_board_markers")
public class TimeBoardMarker {

    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "start_hour")
    private Integer startHour;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "vertical_offset")
    private Integer verticalOffset;

    @Column(name = "title")
    private String title;

    public TimeBoardMarker() {}

    // геттеры и сеттеры

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Integer getStartHour() { return startHour; }
    public void setStartHour(Integer startHour) { this.startHour = startHour; }

    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }

    public Integer getVerticalOffset() { return verticalOffset; }
    public void setVerticalOffset(Integer verticalOffset) { this.verticalOffset = verticalOffset; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
