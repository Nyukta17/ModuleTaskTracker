package com.example.SmartNewsHub.controller;

import com.example.SmartNewsHub.DTO.NewsResponse;
import com.example.SmartNewsHub.service.NewsApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/news")
public class NewsController {
    private final NewsApiService newsApiService;

    @Autowired
    public NewsController(NewsApiService newsApiService){
        this.newsApiService =newsApiService;
    }
    @GetMapping("/last")
    public NewsResponse getLastNews(@RequestParam(defaultValue = "10") int count) {
        return newsApiService.getLastNews(count);
    }
}
