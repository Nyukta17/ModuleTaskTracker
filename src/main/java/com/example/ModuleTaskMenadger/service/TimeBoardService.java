package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.MarkerDTO;
import com.example.ModuleTaskMenadger.model.Project;
import com.example.ModuleTaskMenadger.model.TimeBoardMarker;
import com.example.ModuleTaskMenadger.model.Users;
import com.example.ModuleTaskMenadger.repository.ProjectRepository;
import com.example.ModuleTaskMenadger.repository.TimeBoardMarkerRepository;
import com.example.ModuleTaskMenadger.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimeBoardService {

    private final TimeBoardMarkerRepository markerRepository;
    private final UsersRepository userRepository;
    private final ProjectRepository projectRepository;

    public TimeBoardService(TimeBoardMarkerRepository markerRepository,
                            UsersRepository userRepository,
                            ProjectRepository projectRepository) {
        this.markerRepository = markerRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public void saveTimeBoard(List<MarkerDTO> markerDTOs, String username, Long projectId) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<TimeBoardMarker> markers = markerDTOs.stream().map(dto -> {
            TimeBoardMarker marker = new TimeBoardMarker();
            marker.setId(dto.getId());
            marker.setStartHour(dto.getStartHour());
            marker.setDurationHours(dto.getDurationHours());
            marker.setVerticalOffset(dto.getVerticalOffset());
            marker.setTitle(dto.getTitle());
            marker.setUsers(user);
            marker.setProject(project);
            return marker;
        }).collect(Collectors.toList());

        markerRepository.saveAll(markers);
    }
    @Transactional
    public List<MarkerDTO> getMarkersDtoByProjectAndUser(Long projectId, String username) {
        List<TimeBoardMarker> markers = markerRepository.findByProjectIdAndUsersUsername(projectId, username);
        return markers.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public void clearMarkersByIds(List<Long> ids) {
        markerRepository.deleteAllById(ids);
    }
    @Transactional
    public void clearMarkerById(Long id) {
        markerRepository.deleteById(id);
    }

    // Преобразование Entity в DTO
    private MarkerDTO convertToDto(TimeBoardMarker marker) {
        MarkerDTO dto = new MarkerDTO();
        dto.setId(marker.getId());
        dto.setStartHour(marker.getStartHour());
        dto.setDurationHours(marker.getDurationHours());
        dto.setVerticalOffset(marker.getVerticalOffset());
        dto.setTitle(marker.getTitle());
        return dto;
    }

}

