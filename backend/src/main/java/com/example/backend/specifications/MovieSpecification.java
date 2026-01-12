package com.example.backend.specifications;

import org.springframework.data.jpa.domain.Specification;

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
        return(root, query, cb) -> genre == null ? null : cb.equal(root.get("genre"), genre);
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
