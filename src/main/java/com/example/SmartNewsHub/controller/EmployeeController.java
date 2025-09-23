package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.EmployeeDTO;
import com.example.SmartNewsHub.model.Employee;
import com.example.SmartNewsHub.service.EmployeeService;
import com.example.SmartNewsHub.service.JWTservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final JWTservice jwTservice;
    @Autowired
    public EmployeeController(EmployeeService employeeService,JWTservice jwTservice){
        this.employeeService = employeeService;
        this.jwTservice = jwTservice;
    }
    @GetMapping("/validTokenReg")
    public ResponseEntity<Boolean> validTokenReg(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(false);
        }
        String token = authHeader.substring(7); // Убираем "Bearer " префикс
        boolean valid = employeeService.checkValidTokenForReg(token);
        return ResponseEntity.ok(valid);
    }
    @PostMapping("/createEmployee")
    public ResponseEntity<String> createEmployee(@RequestHeader("Authorization")String tokenHeader, @RequestBody EmployeeDTO dto){
        if(tokenHeader!=null&&tokenHeader.startsWith("Bearer ")){
            String token =tokenHeader.substring(7) ;
            if(jwTservice.validateToken(token)){
                employeeService.createEmployee(dto);
                return ResponseEntity.ok("Пользователь зарегистрирован");
            }
        }
        return ResponseEntity.ok("Пользователь не зарегистрирован");
    }
    @PostMapping("/SingIn")
    public ResponseEntity<String> singInEmployee(@RequestBody EmployeeDTO dto){
        Employee employee = employeeService.singIn(dto);
        StringBuilder FIO= new StringBuilder().append(dto.getFirstName() +" "+dto.getLastName()+" "+dto.getMiddleName());
        String token = jwTservice.generateTokenEmployee(FIO.toString(),dto.getId(),dto.getRole());
        return ResponseEntity.ok(token);
    }
}
