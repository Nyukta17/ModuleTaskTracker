package com.example.SmartNewsHub.model;

import jakarta.persistence.*;

@Entity
@Table(name="Modules_Company")
public class Company_Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Company company;

    @Column(nullable = false)
    private boolean analytics;

    @Column(nullable = false)
    private boolean timeTracker;

    @Column(nullable = false)
    private boolean calendar;

    @Column(nullable = false)
    private boolean companyNews;

    @Column(nullable = false,columnDefinition = "boolean default true")
    private boolean task_tracker_base;

    public boolean isTask_tracker_base() {
        return task_tracker_base;
    }

    public void setTask_tracker_base(boolean task_tracker_base) {
        this.task_tracker_base = task_tracker_base;
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public boolean isAnalytics() {
        return analytics;
    }

    public void setAnalytics(boolean analytics) {
        this.analytics = analytics;
    }

    public boolean isTimeTracker() {
        return timeTracker;
    }

    public void setTimeTracker(boolean timeTracker) {
        this.timeTracker = timeTracker;
    }

    public boolean isCalendar() {
        return calendar;
    }

    public void setCalendar(boolean calendar) {
        this.calendar = calendar;
    }

    public boolean isCompanyNews() {
        return companyNews;
    }

    public void setCompanyNews(boolean companyNews) {
        this.companyNews = companyNews;
    }
}
