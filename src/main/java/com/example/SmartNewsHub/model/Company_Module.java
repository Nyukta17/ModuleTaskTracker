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
    private Users company;

    @Column(nullable = false)
    private boolean analytics;

    @Column(nullable = false)
    private boolean timeTracker;

    @Column(nullable = false)
    private boolean calendar;

    @Column(nullable = false)
    private boolean companyNews;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Users getCompany() {
        return company;
    }

    public void setCompany(Users company) {
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
