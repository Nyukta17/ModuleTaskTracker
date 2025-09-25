package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.EventModuleDTO;

import com.example.SmartNewsHub.service.EventService;
import com.example.SmartNewsHub.service.JWTservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event")
public class EventController {
    private final JWTservice jwTservice;
    private final EventService eventService;
    @Autowired
    public EventController(JWTservice jwTservice,EventService eventService){
        this.eventService=eventService;
        this.jwTservice = jwTservice;
    }
    @PostMapping("/setDate")
    public ResponseEntity<String> setEvent(@RequestHeader("Authorization") String authToken,@RequestBody EventModuleDTO dto){

        if(authToken !=null&&authToken.startsWith("Bearer ")){
            String token = authToken.substring(7);
            if(jwTservice.validateToken(token)){
                eventService.setEvent(dto);
                return ResponseEntity.ok("Event created");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
    }
    @GetMapping("/getDate")
    public ResponseEntity<List<EventModuleDTO>> getEvent(@RequestHeader("Authorization") String authToken){
        if(authToken !=null&&authToken.startsWith("Bearer ")){
            String token = authToken.substring(7);
            if(jwTservice.validateToken(token)){
                List<EventModuleDTO> events = eventService.getAllEvents();
                return ResponseEntity.ok(events);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

    }
    public List<EventModuleDTO> getEventsByCompany(@RequestParam Long companyId) {
        return eventService.getEventsByCompany(companyId);
    }
}
