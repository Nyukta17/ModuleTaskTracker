package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.NewsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NewsApiService {
    @Value("${google.news.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    @Autowired
    public NewsApiService(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }

    public NewsResponse getLastNews(int count){
        String url = String.format("https://newsapi.org/v2/top-headlines?country=us&pageSize=%d&apiKey=%s", count, apiKey);
        return restTemplate.getForObject(url, NewsResponse.class);
    }
}
