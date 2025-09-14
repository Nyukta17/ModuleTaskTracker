package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
}
