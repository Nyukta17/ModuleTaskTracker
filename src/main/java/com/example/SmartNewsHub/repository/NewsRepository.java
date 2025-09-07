package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.NewsModule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository <NewsModule,Long> {
}
