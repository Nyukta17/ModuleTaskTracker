package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.dto.NewsDTO;
import com.example.SmartNewsHub.model.News;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.NewsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    private final CompanyRepository companyRepository;

    @Autowired
    public NewsService(CompanyRepository companyRepository,NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
        this.companyRepository = companyRepository;
    }

    public List<NewsDTO> getAllNews(Long companyId) {
        List<News> news = newsRepository.findAllByCompanyId(companyId);
        List<NewsDTO> dtoList = new ArrayList<>();
        for (News n : news) {
            NewsDTO dto = new NewsDTO();
            dto.setId(n.getId());
            dto.setTitle(n.getTitle());
            dto.setContent(n.getContent());
            dto.setCreatedAt(n.getCreatedAt());
            dto.setCompanyId(n.getCompany() != null ? n.getCompany().getId() : null);
            dtoList.add(dto);
        }
        return dtoList;
    }


    public News getNewsById(Long id) {
        Optional<News> news = newsRepository.findById(id);
        return news.orElse(null);
    }
    @Transactional
    public News createNews(NewsDTO dto) {
        // Можно добавить валидации или преобразования перед сохранением
        News news= new News();
        news.setContent(dto.getContent());
        news.setTitle(dto.getTitle());
        news.setCreatedAt(LocalDateTime.now());
        news.setCompany(companyRepository.findById(dto.getCompanyId()).orElseThrow(null));
        return newsRepository.save(news);
    }

    public Optional<NewsDTO> updateNews(Long id, NewsDTO newsDetails) {
        Optional<News> existingNews = newsRepository.findById(id);
        if (existingNews.isEmpty()) {
            return Optional.empty();
        }
        News news = existingNews.get();
        news.setTitle(newsDetails.getTitle());
        news.setContent(newsDetails.getContent());
        // обновите другие поля при необходимости

        News updatedNews = newsRepository.save(news);

        NewsDTO dto = new NewsDTO();
        dto.setId(updatedNews.getId());
        dto.setTitle(updatedNews.getTitle());
        dto.setContent(updatedNews.getContent());
        dto.setCreatedAt(updatedNews.getCreatedAt());
        // заполните остальные поля DTO

        return Optional.of(dto);
    }


    public boolean deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            return false;
        }
        newsRepository.deleteById(id);
        return true;
    }
}
