package com.example.SmartNewsHub.repository;

import com.example.SmartNewsHub.model.NewsModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface NewsRepository extends JpaRepository <NewsModule,Long> {
    List<NewsModule> findAllByCompany_Id(Long companyId);
}
