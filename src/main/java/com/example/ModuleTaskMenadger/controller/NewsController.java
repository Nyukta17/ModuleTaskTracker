package com.example.ModuleTaskMenadger.controller;

import com.example.ModuleTaskMenadger.details.CustomUserDetails;
import com.example.ModuleTaskMenadger.dto.NewsDTO;
import com.example.ModuleTaskMenadger.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    @Autowired
    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // Получить список всех новостей
    @GetMapping("/getAllNews")
    public ResponseEntity<List<NewsDTO>> getAllNews(@AuthenticationPrincipal CustomUserDetails customUserDetails,@RequestParam("hubId") Long id) {
        List<NewsDTO> newsList = newsService.getAllNews(customUserDetails.getCompanyId(),id);
        return ResponseEntity.ok(newsList);
    }

    // Получить новость по ID
    @GetMapping("/item/{id}")
    public ResponseEntity<NewsDTO> getNewsById(@PathVariable Long id) {
        Optional<NewsDTO> news = newsService.getNewsById(id);
        return news.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Создать новую новость
    @PostMapping("/create")
    public ResponseEntity<NewsDTO> createNews(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody NewsDTO news,@RequestParam("hubId")Long id) {
        boolean isAdmin = customUserDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        boolean isManager = customUserDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_MANAGER"));
        if (isAdmin || isManager) {
            news.setCompanyId(customUserDetails.getCompanyId());
            news.setHubId(id);
            NewsDTO created = newsService.createNews(news);
            return ResponseEntity.ok(created);
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    // Обновить существующую новость
    @PutMapping("/update/{id}")
    public ResponseEntity<NewsDTO> updateNews(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                              @PathVariable Long id,
                                              @RequestBody NewsDTO newsDetails) {
        Optional<NewsDTO> updated = newsService.updateNews(id, newsDetails);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Удалить новость по ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteNews(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                           @PathVariable Long id) {
        boolean deleted = newsService.deleteNews(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
