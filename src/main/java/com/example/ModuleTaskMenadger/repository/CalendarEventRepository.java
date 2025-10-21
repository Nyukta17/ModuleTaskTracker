package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByProjectId(Long projectId);
    // Здесь можно добавить кастомные методы при необходимости
}
