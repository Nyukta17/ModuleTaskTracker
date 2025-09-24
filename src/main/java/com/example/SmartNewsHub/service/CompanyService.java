package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.ModulesDTO;
import com.example.SmartNewsHub.DTO.CompanyDTO;
import com.example.SmartNewsHub.model.Company_Module;
import com.example.SmartNewsHub.model.Company;
import com.example.SmartNewsHub.repository.ModulesRepository;
import com.example.SmartNewsHub.repository.CompanyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Service
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModulesRepository modulesRepository;
    private final JWTservice jwtService;
    public CompanyService(JWTservice jwtService, CompanyRepository companyRepository, PasswordEncoder passwordEncoder, ModulesRepository modulesRepository) {
        this.companyRepository = companyRepository;
        this.passwordEncoder =passwordEncoder;
        this.modulesRepository = modulesRepository;
        this.jwtService = jwtService;
    }

    public Company SingUp(CompanyDTO dto) {
        Company company = new Company();
        company.setEmail(dto.getEmail());
        company.setCompany(dto.getCompany());
        company.setPassword(passwordEncoder.encode(dto.getPassword()));
        company.setRole("Boss");
        return companyRepository.save(company);
    }
    public Company SingIn(CompanyDTO dto) {
        Company company;
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            company = companyRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь с таким email не найден"));
        } else if (dto.getCompany() != null && !dto.getCompany().isEmpty()) {
            company = companyRepository.findByCompany(dto.getCompany())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь с таким ником не найден"));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Нужно указать email или никнейм");
        }
        if (!passwordEncoder.matches(dto.getPassword(), company.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный пароль");
        }
        return company;
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
        System.out.println(jwtService.getCompanyName(token));
        Company company = companyRepository.findByCompany(jwtService.getCompanyName(token)).orElse(null);
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
