package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    boolean existsByName(String name);

    List<Module> findByNameIn(List<String> names);

}
