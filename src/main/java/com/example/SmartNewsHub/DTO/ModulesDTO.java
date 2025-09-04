package com.example.SmartNewsHub.DTO;

import com.example.SmartNewsHub.model.Users;

public class ModulesDTO {
    private long id;
    private Users company;
    private boolean analytics;
    private boolean timeTracker;
    private boolean calendar;
    private boolean companyNews;
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
