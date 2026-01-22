package com.example.backend.betthebracket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.betthebracket.models.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByStatus(String status); // Fetch games based on their status
    boolean existsByRoundAndRegionAndHomeTeamAndAwayTeam(String round, String region, String homeTeam, String awayTeam);
    boolean existsByBracketTag(String bracketTag);
}