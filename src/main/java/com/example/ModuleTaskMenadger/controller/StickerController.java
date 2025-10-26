package com.example.ModuleTaskMenadger.controller;

import com.example.ModuleTaskMenadger.details.CustomUserDetails;
import com.example.ModuleTaskMenadger.dto.StickerDTO;
import com.example.ModuleTaskMenadger.service.StickerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stickers")
public class StickerController {

    private final StickerService stickerService;

    public StickerController(StickerService stickerService) {
        this.stickerService = stickerService;
    }

    @GetMapping("/getStickers")
    public ResponseEntity<List<StickerDTO>> getStickers( @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestParam("hubId") Long projectId) {
        List<StickerDTO> stickers = stickerService.getStickers(projectId, customUserDetails.getUsername());
        return ResponseEntity.ok(stickers);
    }

    @PostMapping("/createSticker")
    public ResponseEntity<StickerDTO> createSticker(@AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody StickerDTO dto,
            @RequestParam("hubId") Long projectId) {
        StickerDTO created = stickerService.saveSticker(dto, projectId, customUserDetails.getUsername());
        return ResponseEntity.status(201).body(created);
    }
    @PostMapping("/saveAll")
    public ResponseEntity<List<StickerDTO>> saveAll(@AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody List<StickerDTO> dtos,
            @RequestParam("hubId") Long projectId) {
        List<StickerDTO> saved = stickerService.saveAllStickers(dtos, projectId, customUserDetails.getUsername());
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/updateSticker/{id}")
    public ResponseEntity<StickerDTO> updateSticker(@AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable Long id,
            @RequestBody StickerDTO dto) {
        dto.setId(id);
        StickerDTO updated = stickerService.updateSticker(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteSticker/{id}")
    public ResponseEntity<?> deleteSticker(@AuthenticationPrincipal CustomUserDetails customUserDetails,@PathVariable Long id) {
        stickerService.deleteSticker(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteStickers")
    public ResponseEntity<?> deleteStickers(@AuthenticationPrincipal CustomUserDetails customUserDetails,@RequestBody List<Long> ids) {
        stickerService.deleteStickersByIds(ids);
        return ResponseEntity.ok().build();
    }
}
