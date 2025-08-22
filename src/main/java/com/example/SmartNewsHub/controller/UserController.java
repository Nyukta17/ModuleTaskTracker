package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.ModulesDTO;
import com.example.SmartNewsHub.DTO.UserDTO;
import com.example.SmartNewsHub.service.JWTservice;
import com.example.SmartNewsHub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/")
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
        String token = jwTservice.generateToken(dto.getCompany(),"lvl1");
        return ResponseEntity.ok(token);
    }
    @PostMapping("/SaveCompanyModules")
    public ResponseEntity<String> SaveCompanyModules(@RequestBody ModulesDTO dto, @RequestHeader("Authorization") String authHeader){
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwTservice.validateToken(token)) {
                userService.SaveCompanyModules(dto);
                return ResponseEntity.ok("Настройки сохранены");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или отсутствующий токен");

    }
    @PostMapping("/GetCompanyModules")
    public ResponseEntity<ModulesDTO> GetCompanyModules(@RequestHeader("Authorization")String authHeader){
        if(authHeader!=null&&authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);
            if(jwTservice.validateToken(token)){
                ModulesDTO modules = userService.GetCompanyModules(token);
                if(modules!=null){
                    return ResponseEntity.ok(modules);
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}
