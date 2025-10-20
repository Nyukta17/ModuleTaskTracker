package com.example.ModuleTaskMenadger.controller;

import com.example.ModuleTaskMenadger.details.CustomUserDetails;
import com.example.ModuleTaskMenadger.dto.CalendarEventDTO;
import com.example.ModuleTaskMenadger.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    // Получить все события календаря
    @GetMapping("/getAllEvents")
    public ResponseEntity<List<CalendarEventDTO>> getAllEvents(@RequestParam("hubId") Long id) {
        List<CalendarEventDTO> events = calendarService.getAllEvents(id);
        return ResponseEntity.ok(events);
    }

    // Получить событие по id
    @GetMapping("/{id}")
    public ResponseEntity<CalendarEventDTO> getEventById(@PathVariable Long id) {
        return calendarService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Создать новое событие
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createEvent")
    public ResponseEntity<CalendarEventDTO> createEvent(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody CalendarEventDTO eventDTO,@RequestParam("hubId") Long id) {
        eventDTO.setHubId(id);
        eventDTO.setCompanyId(customUserDetails.getCompanyId());
        CalendarEventDTO created = calendarService.createEvent(eventDTO,id);
        return ResponseEntity.ok(created);
    }

    // Обновить событие по id
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<CalendarEventDTO> updateEvent( @AuthenticationPrincipal CustomUserDetails customUserDetails,@PathVariable Long id, @RequestBody CalendarEventDTO eventDTO) {
        return calendarService.updateEvent(id, eventDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Удалить событие по id
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@AuthenticationPrincipal CustomUserDetails customUserDetails,@PathVariable Long id) {
        if (calendarService.deleteEvent(id)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
