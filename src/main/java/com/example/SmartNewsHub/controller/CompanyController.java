package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.ModulesDTO;
import com.example.SmartNewsHub.DTO.CompanyDTO;
import com.example.SmartNewsHub.model.Company;
import com.example.SmartNewsHub.service.JWTservice;
import com.example.SmartNewsHub.service.CompanyService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company")
public class CompanyController {
    private final CompanyService companyService;
    private final JWTservice jwTservice;
    @Autowired
    public CompanyController(CompanyService companyService, JWTservice jwTservice){
        this.companyService = companyService;
        this.jwTservice = jwTservice;
    }
    @PostMapping("/SingUp")
    public ResponseEntity<String> SingUp(@RequestBody CompanyDTO dto){
        companyService.SingUp(dto);
        return ResponseEntity.ok("Пользователь зарегистрирован");
    }
    @PostMapping("/SingIn")
    public ResponseEntity<String> SingIn(@RequestBody CompanyDTO dto){
        Company company = companyService.SingIn(dto);
        String token = jwTservice.generateToken(dto.getCompany(),"lvl1",company.getId());
        return ResponseEntity.ok(token);
    }
    @PostMapping("/SaveCompanyModules")
    public ResponseEntity<String> SaveCompanyModules(@RequestBody ModulesDTO dto, @RequestHeader("Authorization") String authHeader){
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwTservice.validateToken(token)) {
                companyService.SaveCompanyModules(dto);
                return ResponseEntity.ok("Настройки сохранены");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или отсутствующий токен");

    }
    @GetMapping("/GetCompanyModules")
    public ResponseEntity<List<ModulesDTO>> GetCompanyModules(@RequestHeader("Authorization")String authHeader){
        if(authHeader!=null&&authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);
            if(jwTservice.validateToken(token)){
                List<ModulesDTO> modules = companyService.GetCompanyModules(token);
                if(modules!=null){
                    return ResponseEntity.ok(modules);
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
    @GetMapping("/CreateUrlForRegUsers")
    public ResponseEntity<String> createUrlForRegUsers(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwTservice.validateToken(token)) {
                    Long companyId = jwTservice.getId(token);
                    if (companyId != null) {
                        String registrationToken = jwTservice.generateRegistrationToken(companyId);
                        String registrationUrl = "http://localhost:5173/register?token=" + registrationToken;
                        return ResponseEntity.ok(registrationUrl);
                    }
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid company ID");
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization header missing or invalid");
    }
}
