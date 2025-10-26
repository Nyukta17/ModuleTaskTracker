package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.StickerDTO;
import com.example.ModuleTaskMenadger.model.Project;
import com.example.ModuleTaskMenadger.model.StickerEntity;
import com.example.ModuleTaskMenadger.model.Users;
import com.example.ModuleTaskMenadger.repository.ProjectRepository;
import com.example.ModuleTaskMenadger.repository.StickerRepository;
import com.example.ModuleTaskMenadger.repository.UsersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StickerService {

    private final StickerRepository stickerRepository;
    private final UsersRepository usersRepository;
    private final ProjectRepository projectRepository;

    public StickerService(StickerRepository stickerRepository, UsersRepository usersRepository, ProjectRepository projectRepository) {
        this.stickerRepository = stickerRepository;
        this.usersRepository = usersRepository;
        this.projectRepository = projectRepository;
    }

    public List<StickerDTO> getStickers(Long projectId, String userName) {
        Long userId = usersRepository.findByUsername(userName).orElseThrow(()->(new RuntimeException("not found"))).getId();
        List<StickerEntity> entities = stickerRepository.findByProjectIdAndUsersId(projectId, userId);
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public StickerDTO saveSticker(StickerDTO dto, Long projectId, String userName) {
        Users user = usersRepository.findByUsername(userName).orElseThrow();
        Project project = projectRepository.findById(projectId).orElseThrow();

        StickerEntity entity = toEntity(dto);
        entity.setUsers(user);
        entity.setProject(project);

        StickerEntity saved = stickerRepository.save(entity);
        return toDto(saved);
    }
    @Transactional
    public List<StickerDTO> saveAllStickers(List<StickerDTO> dtos, Long projectId, String userName) {
        Users user = usersRepository.findByUsername(userName).orElseThrow();
        Project project = projectRepository.findById(projectId).orElseThrow();

        List<StickerEntity> entities = dtos.stream().map(dto -> {
            StickerEntity entity = toEntity(dto);
            entity.setUsers(user);
            entity.setProject(project);
            return entity;
        }).collect(Collectors.toList());

        List<StickerEntity> savedEntities = stickerRepository.saveAll(entities);
        return savedEntities.stream().map(this::toDto).collect(Collectors.toList());
    }


    @Transactional
    public void deleteSticker(Long id) {
        stickerRepository.deleteById(id);
    }


    @Transactional
    public void deleteStickersByIds(List<Long> ids) {
        stickerRepository.deleteAllById(ids);
    }

    @Transactional
    public StickerDTO updateSticker(StickerDTO dto) {
        StickerEntity entity = stickerRepository.findById(dto.getId()).orElseThrow();
        entity.setText(dto.getText());
        entity.setX(dto.getX());
        entity.setY(dto.getY());
        entity.setIsEditing(dto.getIsEditing());
        entity.setDone(dto.getDone());

        StickerEntity saved = stickerRepository.save(entity);
        return toDto(saved);
    }

    private StickerDTO toDto(StickerEntity entity) {
        StickerDTO dto = new StickerDTO();
        dto.setId(entity.getId());
        dto.setText(entity.getText());
        dto.setX(entity.getX());
        dto.setY(entity.getY());
        dto.setIsEditing(entity.getIsEditing());
        dto.setDone(entity.getDone());
        dto.setUserId(entity.getUsers().getId());
        dto.setProjectId(entity.getProject().getId());
        return dto;
    }

    private StickerEntity toEntity(StickerDTO dto) {
        StickerEntity entity = new StickerEntity();
        entity.setId(dto.getId());
        entity.setText(dto.getText());
        entity.setX(dto.getX());
        entity.setY(dto.getY());
        entity.setIsEditing(dto.getIsEditing());
        entity.setDone(dto.getDone());
        // user and project set in saveSticker
        return entity;
    }
}
