package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.NewsModuleDTO;
import com.example.SmartNewsHub.model.NewsModule;
import com.example.SmartNewsHub.service.JWTservice;
import com.example.SmartNewsHub.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {
    JWTservice jwTservice;
    NewsService newsService;
    @Autowired
    public NewsController(JWTservice jwtService, NewsService newsService){
        this.jwTservice = jwtService;
        this.newsService= newsService;
    }
    @GetMapping("/getCompanyNews")
    public ResponseEntity<List<NewsModule>> getAllNews(@RequestHeader("Authorization") String authHead) {
        if(authHead != null && authHead.startsWith("Bearer ")) {
            String token = authHead.substring(7);
            if(jwTservice.validateToken(token)) {
                List<NewsModule> news = newsService.getAllNews(jwTservice.getId(token));
                return ResponseEntity.ok(news);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/createNews")
    public ResponseEntity<String> createNews(@RequestBody NewsModuleDTO dto, @RequestHeader("Authorization") String autoHeader){
        if(autoHeader!=null&&autoHeader.startsWith("Bearer ")){
            String token = autoHeader.substring(7);
            if(jwTservice.validateToken(token)){
                dto.setCompanyId(jwTservice.getId(token));
                newsService.createNews(dto);
                return ResponseEntity.ok("Новость сохранена!");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный или отсутствующий токен");
    }
    @PutMapping("/changeNews/{id}")
    public ResponseEntity<Void> changeNews(@PathVariable Long id,@RequestBody NewsModuleDTO dto, @RequestHeader("Authorization") String authHeader){
        if(authHeader!=null && authHeader.startsWith("Bearer ")){
            String token =authHeader.substring(7);
            if(jwTservice.validateToken(token)){
                newsService.changeNews(id,dto);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @DeleteMapping("/deleteNews/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwTservice.validateToken(token)) {
                newsService.deleteNews(id);
                return ResponseEntity.noContent().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
