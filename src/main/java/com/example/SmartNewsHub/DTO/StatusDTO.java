package com.example.SmartNewsHub.DTO;

import com.example.SmartNewsHub.Enum.TaskStatus;

public  class StatusDTO {
    private TaskStatus status;
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}