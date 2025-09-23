package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.EmployeeDTO;
import com.example.SmartNewsHub.config.SecurityConfig;
import com.example.SmartNewsHub.model.Employee;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    public Employee singIn(EmployeeDTO dto) {
        Employee employee;

        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            employee = employeeRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь с таким email не найден"));
        } else if (dto.getFirstName() != null && dto.getLastName() != null && dto.getMiddleName() != null
                && !dto.getFirstName().isEmpty() && !dto.getLastName().isEmpty() && !dto.getMiddleName().isEmpty()) {

            employee = employeeRepository.findByFirstNameAndLastNameAndMiddleName(
                            dto.getFirstName(), dto.getLastName(), dto.getMiddleName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь с таким ФИО не найден"));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Нужно указать email или ФИО");
        }

        if (!passwordEncoder.matches(dto.getPassword(), employee.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный пароль");
        }
        return employee;
    }


}
