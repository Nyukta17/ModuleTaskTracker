package com.example.ModuleTaskMenadger.repository;

import com.example.ModuleTaskMenadger.model.StickerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StickerRepository extends JpaRepository<StickerEntity, Long> {
    List<StickerEntity> findByProjectId(Long projectId);
    List<StickerEntity> findByUsersId(Long userId);
    List<StickerEntity> findByProjectIdAndUsersId(Long projectId, Long userId);
}
