package com.example.backend.movieconnections.repository;

import com.example.backend.movieconnections.entity.MovieGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieGameRepository extends JpaRepository<MovieGame, Long> {
    boolean existsByDateToGoLive(LocalDate dateToGoLive);
    Optional<MovieGame> findByDateToGoLive(LocalDate dateToGoLive);
    Optional<MovieGame> findTopByOrderByGameIdDesc();
    Optional<MovieGame> findByGameId(Long gameId);
}
