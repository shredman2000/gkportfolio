package com.example.backend.services;
import com.example.backend.repositories.MovieRepository;
import com.example.backend.specifications.MovieSpecification;

import org.springframework.stereotype.Service;

import java.util.List;

import org.hibernate.query.SortDirection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;

import com.example.backend.DTO.MovieFilterRequest;
import com.example.backend.controllers.MovieController;
import com.example.backend.repositories.MovieRepository;
import com.example.backend.models.Movie;


/**
 * 
 */
@Service
public class MovieService {
    

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }


    /**
     * Search movies by genre
     * @param genre a string for selected genre from user
     * @param minRating the minimum audience score to search for
     * @param gunnarsMinRating the minimum gunnars rating to search for
     * @param seed a seed used to shuffle movies, using a seed for stopping duplicates for current user
     * @param pageable a pageable object
     * @return return a pageable list of movies 
     */
    public Page<Movie> searchMovies(String genre, Double minRating, Double gunnarsMinRating, int page, int size, long seed, String sortingMethod, Boolean sortingUp) {
        Specification<Movie> specification = Specification
            .where(MovieSpecification.hasGenre(genre))
            .and(MovieSpecification.minRating(minRating))
            .and(MovieSpecification.gunnarsMinRating(gunnarsMinRating))
            .and(MovieSpecification.shuffle(seed));


        Pageable pageable;
        if (sortingMethod != null) {
            String sortingProp = switch (sortingMethod) {
                case "audience-rating" -> "rating";
                case "gunnar-rating" -> "gunnarsRating";
                default -> "id";
            };

            Sort sort = sortingUp != null && sortingUp ? Sort.by(sortingProp).ascending() : Sort.by(sortingProp).descending();

            pageable = PageRequest.of(page - 1, size, sort);
        } else {
            pageable = PageRequest.of(page - 1, size);
        }

        return movieRepository.findAll(specification, pageable);
    }

    /**
     * Finds the most recently watched films
     * @param num number of movies to return
     * @return a List<Movie> list of movies
     */
    public List<Movie> getRecentlyWatched(int num) {
            Pageable pageable = PageRequest.of(0, num, Sort.by(Sort.Direction.DESC, "dateRated"));

            Page<Movie> page = movieRepository.findAll(pageable);
            
            return page.getContent();
    }

    public List<Movie> getFavoriteMovies(int num) {
        Pageable pageable = PageRequest.of(0, num, Sort.by(Sort.Direction.DESC, "gunnarsRating"));

        Page<Movie> page = movieRepository.findAll(pageable);
        return page.getContent();
    }

}
