package com.example.backend.DTO;

import java.util.List;


/**
 * Wraps the list of movies to be returned
 */
public class MovieListResponse {
    private List<MovieDTO> results;
    private long totalElements;
    private int totalPages;



    public MovieListResponse (List<MovieDTO> results, long totalElements, int totalPages) {
        this.results = results;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public List<MovieDTO> getResults() {
        return results;
    }
    public long getTotalElements() {
        return totalElements;
    }
    public int getTotalPages() {
        return totalPages;
    }
}
