package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.EventModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventModule,Long> {
    List<EventModule> findByDateTimeBetween(LocalDate start, LocalDate end);

    @Query("SELECT e FROM EventModule e WHERE e.employee.company.id = :companyId")
    List<EventModule> findByCompanyId(@Param("companyId") Long companyId);

    List<EventModule> findAll();
}
