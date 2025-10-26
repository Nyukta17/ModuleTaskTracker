package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.TimeBoardMarker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeBoardMarkerRepository extends JpaRepository<TimeBoardMarker, Long> {

    // Можно добавить методы поиска по проекту (hub) и пользователю
    List<TimeBoardMarker> findByProjectId(Long projectId);

    List<TimeBoardMarker> findByUsersUsername(String username);

    List<TimeBoardMarker> findByProjectIdAndUsersUsername(Long projectId, String username);
}
