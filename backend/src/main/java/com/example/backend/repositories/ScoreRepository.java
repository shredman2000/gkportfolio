package com.example.backend.repositories;

import com.example.backend.models.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long>{
    // get top percent by users score
    
}
