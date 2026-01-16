package com.example.backend.specifications;

import java.util.Set;

import jakarta.persistence.criteria.Join;

import org.springframework.data.jpa.domain.Specification;

import com.example.backend.models.Genre;
import com.example.backend.models.Movie;


/**
 * Specifications for querying the db for movies
 * Use:
 * .hasGenre("genre")
 * .minRating(Double rating)
 * .gunnarsMinRating(Double gunnarsMinRating)
 */
public class MovieSpecification {
    
    /* Movies with the selected genre tag */
    public static Specification<Movie> hasGenre(String genre) {
        return (root, query, cb) -> {
            if (genre == null || genre.isEmpty()) {
                return cb.conjunction(); // no filter
            }
            Join<Movie, Genre> genreJoin = root.join("genres");
            return genreJoin.get("name").in(genre);
        };
    }

    /* Movies at or above a selected minimum rating */
    public static Specification<Movie> minRating(Double rating) {
        return(root, query, cb) -> rating == null ? null : cb.greaterThanOrEqualTo(root.get("rating"), rating);
    }
    /* Movies at or above a selected minimum rating by gunnar*/
    public static Specification<Movie> gunnarsMinRating(Double gunnarsRating) {
        return(root, query, cb) -> gunnarsRating == null ? null : cb.greaterThanOrEqualTo(root.get("gunnarsRating"), gunnarsRating);
    }

}
