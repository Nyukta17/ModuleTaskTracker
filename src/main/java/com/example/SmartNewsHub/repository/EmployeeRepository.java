package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    List<Employee> findByLastName(String lastName);
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByFirstNameAndLastNameAndMiddleName(String firstName, String lastName, String middleName);

}
