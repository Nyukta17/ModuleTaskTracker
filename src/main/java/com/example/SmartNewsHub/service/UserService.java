package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.ModulesDTO;
import com.example.SmartNewsHub.DTO.UserDTO;
import com.example.SmartNewsHub.model.Company_Module;
import com.example.SmartNewsHub.model.Users;
import com.example.SmartNewsHub.repository.ModulesRepository;
import com.example.SmartNewsHub.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModulesRepository modulesRepository;
    private final JWTservice jwtService;
    public UserService(JWTservice jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder,ModulesRepository modulesRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder =passwordEncoder;
        this.modulesRepository = modulesRepository;
        this.jwtService = jwtService;
    }

    public Users SingUp(UserDTO dto) {
        Users user = new Users();
        user.setEmail(dto.getEmail());
        user.setCompany(dto.getCompany());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("lvl1");
        return userRepository.save(user);
    }
    public Users SingIn(UserDTO dto) {
        Users user;
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь с таким email не найден"));
        } else if (dto.getCompany() != null && !dto.getCompany().isEmpty()) {
            user = userRepository.findByCompany(dto.getCompany())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь с таким ником не найден"));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Нужно указать email или никнейм");
        }
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный пароль");
        }
        return user;
    }
    public Company_Module SaveCompanyModules(ModulesDTO dto){
        Company_Module companyModule= new Company_Module();
        companyModule.setCompany(dto.getCompany());
        companyModule.setAnalytics(dto.isAnalytics());
        companyModule.setTimeTracker(dto.isTimeTracker());
        companyModule.setCalendar(dto.isCalendar());
        companyModule.setCompanyNews(dto.isCompanyNews());

        return modulesRepository.save(companyModule);
    }
    public List<ModulesDTO> GetCompanyModules(String token){
        Users company = userRepository.findByCompany(jwtService.getCompanyName(token)).orElse(null);
        if(company != null){
            List<Company_Module> companyModules = modulesRepository.findByCompany(company);
            List<ModulesDTO> dtos = new ArrayList<>();
            for (Company_Module md : companyModules) {
                ModulesDTO dto = new ModulesDTO();
                dto.setId(md.getId());
                dto.setCompany(md.getCompany());
                dto.setAnalytics(md.isAnalytics());
                dto.setTimeTracker(md.isTimeTracker());
                dto.setCalendar(md.isCalendar());
                dto.setTask_tracker_base(md.isTask_tracker_base());
                dto.setCompanyNews(md.isCompanyNews());
                dtos.add(dto);
            }
            return dtos;
        }
        return Collections.emptyList();
    }


}
