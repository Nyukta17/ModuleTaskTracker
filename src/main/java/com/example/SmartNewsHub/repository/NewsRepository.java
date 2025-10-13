package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findAllByCompanyId(Long companyId);
}
