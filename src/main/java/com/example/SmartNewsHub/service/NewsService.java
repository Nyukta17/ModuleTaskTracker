package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.NewsModuleDTO;
import com.example.SmartNewsHub.model.Company;
import com.example.SmartNewsHub.model.NewsModule;
import com.example.SmartNewsHub.repository.CompanyRepository;
import com.example.SmartNewsHub.repository.NewsRepository;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;

public class NewsService {
    private JWTservice jwTservice;
    private NewsRepository newsRepository;
    private CompanyRepository companyRepository;
    public NewsService(JWTservice jwTservice,NewsRepository newsRepository,CompanyRepository companyRepository){
        this.jwTservice = jwTservice;
        this.newsRepository = newsRepository;
        this.companyRepository= companyRepository;
    }

    public NewsModule createNews(NewsModuleDTO dto){
        NewsModule news = new NewsModule();
        Company company = companyRepository.findById(dto.getCompanyId()).orElseThrow(() -> new EntityNotFoundException("Company not found"));;
        news.setTitle(dto.getTitle());
        news.setContent(dto.getContent());
        news.setCompany(company);
        news.setCreatedBy(null);
        return newsRepository.save(news);
    }
    public void deleteNews(Long id){
        NewsModule news = newsRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Новость не найдена"));
        newsRepository.delete(news);
    }
    public void changeNews(Long id,NewsModuleDTO dto){
        NewsModule news = newsRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Новость не найдена"));
        news.setTitle(dto.getTitle());
        news.setContent(dto.getContent());
        news.setCreatedAt(LocalDateTime.now());
        newsRepository.save(news);
    }

}
