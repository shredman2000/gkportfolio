package com.example.backend.betthebracket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.betthebracket.models.CBBGame;

@Repository
public interface CBBGameRepository extends JpaRepository<CBBGame, Long> {
    
    
}
