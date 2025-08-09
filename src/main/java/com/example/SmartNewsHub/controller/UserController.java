package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.UserDTO;
import com.example.SmartNewsHub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService){
        this.userService = userService;
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO dto){
        userService.registerUser(dto);
        return ResponseEntity.ok("Пользователь зарегистрирован");
    }
}
