package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.details.CustomUserDetails;
import com.example.SmartNewsHub.dto.NewsDTO;
import com.example.SmartNewsHub.model.News;
import com.example.SmartNewsHub.service.NewsService;
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
    public ResponseEntity<List<NewsDTO>> getAllNews(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        List<NewsDTO> newsList = newsService.getAllNews(customUserDetails.getCompanyId());
        return ResponseEntity.ok(newsList);
    }

    // Получить новость по ID
    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        News news = newsService.getNewsById(id);
        if (news == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(news);
    }

    // Создать новую новость
    @PostMapping("/createNews")
    public ResponseEntity<News> createNews(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody NewsDTO news) {
        boolean isAdmin = customUserDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        boolean isManager = customUserDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_MANAGER"));

        if (isAdmin || isManager) {
            news.setCompanyId(customUserDetails.getCompanyId());
            News created = newsService.createNews(news);
            return ResponseEntity.ok(created);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    // Обновить существующую новость
    @PutMapping("/update/{id}")
    public ResponseEntity<NewsDTO> updateNews(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable Long id,
            @RequestBody NewsDTO newsDetails) {

        Optional<NewsDTO> updated = newsService.updateNews(id, newsDetails);

        return updated
                .map(dto -> ResponseEntity.ok(dto))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    // Удалить новость по ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteNews(@AuthenticationPrincipal CustomUserDetails customUserDetails,@PathVariable Long id) {
        boolean deleted = newsService.deleteNews(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
