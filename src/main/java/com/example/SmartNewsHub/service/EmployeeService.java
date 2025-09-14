package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.EmployeeDTO;
import com.example.SmartNewsHub.config.SecurityConfig;
import com.example.SmartNewsHub.model.Employee;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    private final JWTservice jwTservice;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    @Autowired
    public EmployeeService(JWTservice jwTservice,PasswordEncoder passwordEncoder,EmployeeRepository employeeRepository,CompanyRepository companyRepository){
        this.jwTservice = jwTservice;
        this.passwordEncoder =passwordEncoder;
        this.employeeRepository=employeeRepository;
        this.companyRepository = companyRepository;
    }
    public boolean checkValidTokenForReg(String token){
        return jwTservice.validateToken(token);
    }
    public Employee createEmployee(EmployeeDTO dto){
        Employee employee = new Employee();
        employee.setLastName(dto.getLastName());
        employee.setFirstName(dto.getFirstName());
        employee.setMiddleName(dto.getMiddleName());
        employee.setPassword(passwordEncoder.encode(dto.getPassword()));
        employee.setEmail(dto.getEmail());
        employee.setBirthDay(dto.getBirthday());
        companyRepository.findById(dto.getCompanyId()).ifPresent(employee::setCompany);
        employee.setRole("empty");
        return employeeRepository.save(employee);
    }
}
