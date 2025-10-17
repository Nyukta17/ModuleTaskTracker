package com.example.ModuleTaskMenadger.service;

import com.example.ModuleTaskMenadger.dto.NewsDTO;
import com.example.ModuleTaskMenadger.model.News;
import com.example.ModuleTaskMenadger.repository.CompanyRepository;
import com.example.ModuleTaskMenadger.repository.NewsRepository;
import com.example.ModuleTaskMenadger.repository.ProjectRepository;
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
    private final ProjectRepository projectRepository;

    @Autowired
    public NewsService(CompanyRepository companyRepository,NewsRepository newsRepository,ProjectRepository projectRepository) {
        this.newsRepository = newsRepository;
        this.companyRepository = companyRepository;
        this.projectRepository = projectRepository;
    }

    public List<NewsDTO> getAllNews(Long companyId,Long id) {
        List<News> news = newsRepository.findAllByCompanyIdAndProjectId(companyId,id);
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


    public Optional<NewsDTO> getNewsById(Long id) {
        Optional<News> newsOptional = newsRepository.findById(id);
        return newsOptional.map(this::convertToDto);
    }

    @Transactional
    public NewsDTO createNews(NewsDTO dto) {
        News news = new News();
        news.setContent(dto.getContent());
        news.setTitle(dto.getTitle());
        news.setCreatedAt(LocalDateTime.now());
        news.setCompany(companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Company not found")));
        news.setProject(projectRepository.findById(dto.getHubId()).orElseThrow(()->new RuntimeException("Проект не найден")));
        News saved = newsRepository.save(news);

        return convertToDto(saved);
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

    private NewsDTO convertToDto(News news) {
        NewsDTO dto = new NewsDTO();
        dto.setId(news.getId());
        dto.setCompanyId(news.getCompany() != null ? news.getCompany().getId() : null);
        dto.setTitle(news.getTitle());
        dto.setContent(news.getContent());
        dto.setCreatedAt(news.getCreatedAt());
        return dto;
    }
}
