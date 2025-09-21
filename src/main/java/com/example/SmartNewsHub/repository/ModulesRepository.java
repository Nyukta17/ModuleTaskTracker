package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Company_Module;
import com.example.SmartNewsHub.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModulesRepository extends JpaRepository<Company_Module,Long>{
    List<Company_Module> findByCompany(Company Company);
    List<Company_Module> findByCompanyId(Long id);
}
