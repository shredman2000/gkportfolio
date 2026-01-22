package com.example.backend.betthebracket.repository;

import com.example.backend.betthebracket.models.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    // TODO: Search with team name, return teams specific db key maybe  
}