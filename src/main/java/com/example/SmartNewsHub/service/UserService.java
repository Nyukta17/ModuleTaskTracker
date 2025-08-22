package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.ModulesDTO;
import com.example.SmartNewsHub.DTO.UserDTO;
import com.example.SmartNewsHub.model.Company_Module;
import com.example.SmartNewsHub.model.Users;
import com.example.SmartNewsHub.repository.ModulesRepository;
import com.example.SmartNewsHub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    public Users SingIn(UserDTO dto){
        Users user;
        if(dto.getEmail()!=null && !dto.getEmail().isEmpty()){
            user = userRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Пользователь с таким email не найден"));
        }
        else if(dto.getCompany()!=null && !dto.getCompany().isEmpty()){
            user = userRepository.findByCompany(dto.getCompany()).orElseThrow(()->new RuntimeException("Пользователь с таким ником не найден"));
        }
        else{throw new RuntimeException("Нужно указать email или никнейм");}
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный пароль");
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
    public ModulesDTO GetCompanyModules(String token){
        Users company = userRepository.findByCompany(jwtService.getCompanyName(token)).orElse(null);
        if(company!=null){
            Optional<Company_Module> companyModuleOpt = modulesRepository.findByCompany(company);
            if(companyModuleOpt.isPresent()){
                Company_Module md = companyModuleOpt.get();
                ModulesDTO dto = new ModulesDTO();
                dto.setId(md.getId());
                dto.setCompany(md.getCompany());
                dto.setAnalytics(md.isAnalytics());
                dto.setTimeTracker(md.isTimeTracker());
                dto.setCalendar(md.isCalendar());
                dto.setCompanyNews(md.isCompanyNews());
                return dto;
            }

        }
        return null;
    }

}
