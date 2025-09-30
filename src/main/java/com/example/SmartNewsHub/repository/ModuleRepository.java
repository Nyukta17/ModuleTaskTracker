package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    boolean existsByName(String name);
}
