package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.StreamingService;

public interface StreamingServiceRepository extends JpaRepository<StreamingService, Long> {
    
}
