package com.example.backend.DTO;

import java.util.List;


/**
 * Wraps the list of movies to be returned
 */
public class MovieListResponse {
    private List<MovieDTO> results;
    private long total;



    public MovieListResponse (List<MovieDTO> results, long total) {
        this.results = results;
        this.total = total;
    }

    public List<MovieDTO> getResults() {
        return results;
    }
    public long getTotal() {
        return total;
    }
}
