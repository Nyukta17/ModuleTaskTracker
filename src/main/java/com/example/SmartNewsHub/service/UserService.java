package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.dto.RegisterRequest;
import com.example.SmartNewsHub.model.Company;
import com.example.SmartNewsHub.model.Role;
import com.example.SmartNewsHub.model.Users;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.RoleRepository;
import com.example.SmartNewsHub.repository.UsersRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

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

}

