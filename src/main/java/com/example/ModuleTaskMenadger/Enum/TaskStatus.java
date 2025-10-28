package com.example.ModuleTaskMenadger.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TaskStatus {
    NEW,
    IN_PROGRESS,
    TESTING,
    COMPLETED;

    @JsonCreator
    public static TaskStatus forValue(String value) {
        if ("DONE".equalsIgnoreCase(value)) {
            return COMPLETED;
        }
        return TaskStatus.valueOf(value.toUpperCase());
    }
}
