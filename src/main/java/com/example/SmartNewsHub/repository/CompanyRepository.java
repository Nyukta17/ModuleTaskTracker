package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company,Long> {
    Optional<Company> findByEmail(String email);
    Optional<Company> findByCompany(String Company);
    Optional<Company> findById(Long id);
}
