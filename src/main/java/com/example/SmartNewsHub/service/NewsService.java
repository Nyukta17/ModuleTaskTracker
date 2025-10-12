package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.model.News;
import com.example.SmartNewsHub.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    @Autowired
    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    public News getNewsById(Long id) {
        Optional<News> news = newsRepository.findById(id);
        return news.orElse(null);
    }

    public News createNews(News news) {
        // Можно добавить валидации или преобразования перед сохранением
        return newsRepository.save(news);
    }

    public News updateNews(Long id, News newsDetails) {
        Optional<News> existingNews = newsRepository.findById(id);
        if (existingNews.isEmpty()) {
            return null;
        }
        News news = existingNews.get();
        news.setTitle(newsDetails.getTitle());
        news.setContent(newsDetails.getContent());
        // обновите другие поля, если есть
        return newsRepository.save(news);
    }

    public boolean deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            return false;
        }
        newsRepository.deleteById(id);
        return true;
    }
}
