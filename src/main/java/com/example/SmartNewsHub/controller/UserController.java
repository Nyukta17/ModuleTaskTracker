package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.UserDTO;
import com.example.SmartNewsHub.service.JWTservice;
import com.example.SmartNewsHub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;
    private final JWTservice jwTservice;
    @Autowired
    public UserController(UserService userService,JWTservice jwTservice){
        this.userService = userService;
        this.jwTservice = jwTservice;
    }
    @PostMapping("/SingUp")
    public ResponseEntity<String> SingUp(@RequestBody UserDTO dto){
        userService.SingUp(dto);
        return ResponseEntity.ok("Пользователь зарегистрирован");
    }
    @PostMapping("/SingIn")
    public ResponseEntity<String> SingIn(@RequestBody UserDTO dto){
        userService.SingIn(dto);
        String token = jwTservice.generateToken(dto.getNickName(),"lvl1");
        return ResponseEntity.ok(token);
    }
}
