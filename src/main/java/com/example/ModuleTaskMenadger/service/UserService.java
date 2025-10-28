package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.RegisterRequest;
import com.example.ModuleTaskMenadger.dto.RegistrationEmployee;
import com.example.ModuleTaskMenadger.dto.UserDTO;
import com.example.ModuleTaskMenadger.model.Company;
import com.example.ModuleTaskMenadger.model.Role;
import com.example.ModuleTaskMenadger.model.Users;
import com.example.ModuleTaskMenadger.repository.CompanyRepository;
import com.example.ModuleTaskMenadger.repository.RoleRepository;
import com.example.ModuleTaskMenadger.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UsersRepository usersRepository;
    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UsersRepository usersRepository,
                       CompanyRepository companyRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.companyRepository = companyRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterRequest request) {

        if (usersRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Company company = companyRepository.findByName(request.getCompany())
                .orElseGet(() -> {
                    Company c = new Company();
                    c.setName(request.getCompany());
                    c.setEmail(request.getEmail());
                    c.setPhone(request.getPhone());
                    return companyRepository.save(c);
                });

        // Если роль не указана, присваиваем роль ADMIN по умолчанию
        String roleName = request.getRole();
        if (roleName == null || roleName.isBlank()) {
            roleName = "ADMIN";
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCompany(company);
        user.setRoles(Set.of(role));
        user.setEnabled(true);

        usersRepository.save(user);
    }


    public void registerEmployee(RegistrationEmployee employee){
        if(usersRepository.findByUsername(employee.getUsername()).isPresent()){
            throw  new IllegalArgumentException("Username is already taken");
        } // Поменять логику, могут быть тёски
        Company company = companyRepository.findById(employee.getCompany_id()).orElseThrow(()->new IllegalArgumentException("Company not found"));
        Role role = roleRepository.findByName("USER").orElseThrow(()->new IllegalArgumentException("Role not found"));
        Users user = new Users();
        user.setUsername(employee.getUsername());
        user.setRoles(Set.of(role));
        user.setCompany(company);
        user.setPassword(passwordEncoder.encode(employee.getPassword()));
        user.setEnabled(true);
        usersRepository.save(user);
    }

    @Transactional
    public void changeUserRole(Long userId, String newRoleName) {
        if (newRoleName != null) {
            newRoleName = newRoleName.replace("\"", "");
        }
        Optional<Users> optionalUser = usersRepository.findById(userId);
        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            Optional<Role> role = roleRepository.findByName(newRoleName);
            if (role.isPresent()) {
                Set<Role> newRoles = new HashSet<>();
                newRoles.add(role.get());
                user.setRoles(newRoles);  // Обязательно изменяемая коллекция
                usersRepository.save(user);
            } else {
                throw new IllegalArgumentException("Role not found: " + newRoleName);
            }
        } else {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
    }
    public List<Users> getAllUsersByCompanyID(Long companyId){
        return usersRepository.findByCompanyId(companyId);
    }
    public List<UserDTO> getAllExceptAdmins(Long companyId) {
        return usersRepository.findAllExceptAdminsByCompanyId(companyId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    public UserDTO toDto(Users user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO(user.getId(), user.getUsername());
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            dto.setRole(user.getRoles().iterator().next().getName());
        } else {
            dto.setRole("UNKNOWN");
        }
        return dto;
    }
}

