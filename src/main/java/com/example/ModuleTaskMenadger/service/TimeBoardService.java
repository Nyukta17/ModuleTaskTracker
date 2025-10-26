package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.MarkerDTO;
import com.example.ModuleTaskMenadger.model.TimeBoardMarker;
import com.example.ModuleTaskMenadger.repository.ProjectRepository;
import com.example.ModuleTaskMenadger.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimeBoardService {

    private final TimeBoardMarkerRepository markerRepository;
    private final UsersRepository userRepository;
    private final ProjectRepository projectRepository;

    public TimeBoardService(TimeBoardMarkerRepository markerRepository,
                            UserRepository userRepository,
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
}

