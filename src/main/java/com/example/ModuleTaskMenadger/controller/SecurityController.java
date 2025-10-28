package com.example.ModuleTaskMenadger.controller;

import com.example.ModuleTaskMenadger.details.CustomUserDetails;
import com.example.ModuleTaskMenadger.dto.*;
import com.example.ModuleTaskMenadger.model.Users;
import com.example.ModuleTaskMenadger.service.JWTservice;
import com.example.ModuleTaskMenadger.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class SecurityController {

    private final JWTservice jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public SecurityController(JWTservice jwtService, AuthenticationManager authenticationManager,UserService userService){
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

            String roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));

            String token = jwtService.generateToken(userDetails.getUsername(), roles,userDetails.getCompanyId(),userDetails.getUserId());

            return ResponseEntity.ok(new JWTResponse(token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest registerRequest) {
        try {
            userService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/generate-registration-link")
    public ResponseEntity<String> generateRegistrationLink(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody Map<String, String> body) {
        Instant now = Instant.now();
        Date expiryDate = Date.from(now.plus(1, ChronoUnit.DAYS)); // срок жизни 1 день

        String token = jwtService.generateTokenForRegistration(
                Map.of("registration", true), // оставляем claims без exp
                expiryDate,
                customUserDetails.getCompanyId()// срок жизни передаем отдельно
        );

        String registrationUrl = "http://localhost:5173/register?token=" + token;

        return ResponseEntity.ok(registrationUrl);
    }
    @PostMapping("/register-user")
    public ResponseEntity<?> registrationEmployee(@RequestBody RegistrationEmployee registrationEmployee){
        try {
            // Валидация токена приглашения, переданного например в registrationEmployee.getToken()
            if (!jwtService.validateToken(registrationEmployee.getToken())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Невалидный токен");
            }

            // Извлечь необходимые данные из токена (например, companyId)
            Long companyId = jwtService.extractCompanyId(registrationEmployee.getToken());
            registrationEmployee.setCompany_id(companyId);

            userService.registerEmployee(registrationEmployee);
            return ResponseEntity.ok("Регистрация успешна");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/get-users")
    public List<UserDTO> getUsers(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        List<Users> users = userService.getAllUsersByCompanyID(customUserDetails.getCompanyId());
        return users.stream()
                .map(u -> new UserDTO(u.getId(),u.getUsername()))
                .collect(Collectors.toList());
    }
    @GetMapping("/users/no-admins")
    public ResponseEntity<List<UserDTO>> getUsersExceptAdmins(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        List<UserDTO> users = userService.getAllExceptAdmins(customUserDetails.getCompanyId());
        return ResponseEntity.ok(users);
    }
    @PutMapping("users/{id}/role")
    public ResponseEntity<?> changeUserRole(@AuthenticationPrincipal CustomUserDetails customUserDetails,@PathVariable Long id, @RequestBody() String newRoleName) {
        userService.changeUserRole(id, newRoleName);
        return ResponseEntity.ok().build();
    }


}
