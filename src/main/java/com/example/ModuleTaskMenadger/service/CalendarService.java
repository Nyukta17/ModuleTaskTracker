package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.CalendarEventDTO;
import com.example.ModuleTaskMenadger.model.CalendarEvent;
import com.example.ModuleTaskMenadger.model.Company;
import com.example.ModuleTaskMenadger.model.Task;
import com.example.ModuleTaskMenadger.repository.CalendarEventRepository;
import com.example.ModuleTaskMenadger.repository.CompanyRepository;
import com.example.ModuleTaskMenadger.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    @Autowired
    private CalendarEventRepository calendarEventRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<CalendarEventDTO> getAllEvents() {
        return calendarEventRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CalendarEventDTO> getEventById(Long id) {
        return calendarEventRepository.findById(id)
                .map(this::convertToDto);
    }

    public CalendarEventDTO createEvent(CalendarEventDTO dto) {
        CalendarEvent event = convertToEntity(dto);
        CalendarEvent saved = calendarEventRepository.save(event);
        return convertToDto(saved);
    }

    public Optional<CalendarEventDTO> updateEvent(Long id, CalendarEventDTO dto) {
        Optional<CalendarEvent> existing = calendarEventRepository.findById(id);
        if (existing.isEmpty()) {
            return Optional.empty();
        }
        CalendarEvent event = existing.get();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartDateTime(dto.getStartDateTime());
        event.setEndDateTime(dto.getEndDateTime());

        if (dto.getCompanyId() != null) {
            companyRepository.findById(dto.getCompanyId()).ifPresent(event::setCompany);
        }

        if (dto.getTaskId() != null) {
            taskRepository.findById(dto.getTaskId()).ifPresent(event::setTask);
        }

        CalendarEvent updated = calendarEventRepository.save(event);
        return Optional.of(convertToDto(updated));
    }

    public boolean deleteEvent(Long id) {
        if (!calendarEventRepository.existsById(id)) {
            return false;
        }
        calendarEventRepository.deleteById(id);
        return true;
    }

    private CalendarEventDTO convertToDto(CalendarEvent event) {
        CalendarEventDTO dto = new CalendarEventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDateTime(event.getStartDateTime());
        dto.setEndDateTime(event.getEndDateTime());
        dto.setCreatedAt(event.getCreatedAt());
        if (event.getCompany() != null) {
            dto.setCompanyId(event.getCompany().getId());
        }
        if (event.getTask() != null) {
            dto.setTaskId(event.getTask().getId());
        }
        return dto;
    }

    private CalendarEvent convertToEntity(CalendarEventDTO dto) {
        CalendarEvent event = new CalendarEvent();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartDateTime(dto.getStartDateTime());
        event.setEndDateTime(dto.getEndDateTime());

        if (dto.getCompanyId() != null) {
            Company company = companyRepository.findById(dto.getCompanyId()).orElse(null);
            event.setCompany(company);
        }

        if (dto.getTaskId() != null) {
            Task task = taskRepository.findById(dto.getTaskId()).orElse(null);
            event.setTask(task);
        }

        return event;
    }
}
