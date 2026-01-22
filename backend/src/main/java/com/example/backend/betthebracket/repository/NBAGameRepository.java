package com.example.backend.betthebracket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.betthebracket.models.NBAGame;

@Repository
public interface  NBAGameRepository extends JpaRepository<NBAGame, Long> {
    List<NBAGame> findByStatus(String status);
    Optional<NBAGame> findByHomeTeamAndAwayTeamAndDate(String homeTeam, String awayTeam, String date);
    //NBAGame findByHomeOrAway(String homeTeam, String awayTeam);
}
