package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    boolean existsByName(String name);

    List<Module> findByNameIn(List<String> names);
    List<Module> findByProject_Id(Long id);
}
