package com.example.backend.betthebracket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.betthebracket.models.Bet;


@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    List<Bet> findByUserId(Long userId);
    List<Bet> findByIsOpenTrue();   // Get only open bets
    List<Bet> findByIsOpenFalse();  // Get only closed bets
    List<Bet> findByGameId(Long gameId);
    List<Bet> findByUserIdAndIsOpenTrue(Long userId);  // Get open bets for a specific user
    List<Bet> findByUserIdAndIsOpenFalse(Long userId);  // Get closed bets for a specific user
    List<Bet> findByGameIdAndSport(Long gameId, String sport);
}