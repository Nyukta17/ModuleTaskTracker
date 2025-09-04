package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Company_Module;
import com.example.SmartNewsHub.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ModulesRepository extends JpaRepository<Company_Module,Long>{
    List<Company_Module> findByCompany(Users Company);
}
