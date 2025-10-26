package com.example.ModuleTaskMenadger.controller;

import com.example.ModuleTaskMenadger.details.CustomUserDetails;
import com.example.ModuleTaskMenadger.dto.MarkerDTO;
import com.example.ModuleTaskMenadger.service.TimeBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/timeTracker")
public class TimeTrackerController {
    @Autowired
    private TimeBoardService timeBoardService;
    @PostMapping("/saveTimeBoard")
    public ResponseEntity<?> saveTimeBoard(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody List<MarkerDTO> markerDTO, @RequestParam("hubId") Long projectId) {
        timeBoardService.saveTimeBoard(markerDTO,customUserDetails.getUsername(),projectId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/getMarkers")
    public ResponseEntity<List<MarkerDTO>> getMarkers(@AuthenticationPrincipal CustomUserDetails customUserDetails,@RequestParam("hubId") Long projectId) {
        List<MarkerDTO> markers = timeBoardService.getMarkersDtoByProjectAndUser(projectId, customUserDetails.getUsername());
        return ResponseEntity.ok(markers);
    }
    @DeleteMapping("/clearMarker")
    public ResponseEntity<?> clearMarkerById(@AuthenticationPrincipal CustomUserDetails customUserDetails,@RequestParam("markerId") Long id) {
        timeBoardService.clearMarkerById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clearMarkers")
    public ResponseEntity<?> clearMarkersByIds(@AuthenticationPrincipal CustomUserDetails customUserDetails,@RequestBody List<Long> ids) {
        timeBoardService.clearMarkersByIds(ids);
        return ResponseEntity.ok().build();
    }


}
