package com.example.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Genre;

public interface GenreRepository extends JpaRepository<Genre, Long>{
    Optional<Genre> findByName(String genreName);
}
