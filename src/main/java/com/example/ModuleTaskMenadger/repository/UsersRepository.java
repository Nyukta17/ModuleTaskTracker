package com.example.ModuleTaskMenadger.repository;


import com.example.ModuleTaskMenadger.dto.UserDTO;
import com.example.ModuleTaskMenadger.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
    List<Users> findByCompanyId(Long companyId);
    @Query("SELECT u FROM Users u JOIN u.roles r WHERE r.name <> 'ADMIN' AND u.company.id = :companyId")
    List<Users> findAllExceptAdminsByCompanyId(@Param("companyId") Long companyId);


}
