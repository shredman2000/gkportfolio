package com.example.backend.services;
import com.example.backend.repositories.MovieRepository;
import com.example.backend.specifications.MovieSpecification;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.example.backend.DTO.MovieFilterRequest;
import com.example.backend.controllers.MovieController;
import com.example.backend.repositories.MovieRepository;
import com.example.backend.models.Movie;

@Service
public class MovieService {
    

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Page<Movie> searchMovies(MovieFilterRequest filters, Pageable pageable) {
        Specification<Movie> specification = Specification
            .where(MovieSpecification.hasGenre(filters.getGenre()))
            .and(MovieSpecification.minRating(filters.getMinRating()))
            .and(MovieSpecification.gunnarsMinRating(filters.getGunnarsMinRating()));

        return movieRepository.findAll(specification, pageable);

    }

}
