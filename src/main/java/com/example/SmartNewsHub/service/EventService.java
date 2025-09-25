package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.EventModuleDTO;
import com.example.SmartNewsHub.model.EventModule;
import com.example.SmartNewsHub.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository){
        this.eventRepository = eventRepository;
    }

    public List<EventModuleDTO> getAllEvents() {
        List<EventModule> events = eventRepository.findAll();
        return events.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private EventModuleDTO toDTO(EventModule event) {
        EventModuleDTO dto = new EventModuleDTO();
        dto.setId(event.getId());
        dto.setText(event.getText());
        dto.setDateTime(event.getDateTime());
        return dto;
    }

    public List<EventModuleDTO> getEventsByCompany(Long companyId) {
        // Реализация будет, когда появится потребность
        return null;
    }

    public EventModule setEvent(EventModuleDTO dto){
        EventModule eventModule = new EventModule();
        eventModule.setText(dto.getText());
        eventModule.setDateTime(dto.getDateTime());
        eventModule.setType(dto.getType());
        eventModule.setUser(null);
        return eventRepository.save(eventModule);
    }
}

