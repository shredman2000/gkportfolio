package com.example.backend.DTO;

import java.util.Set;

public class MovieFilterRequest {
    private Set<String> genres;
    private Double minRating;
    private Double gunnarsMinRating;

    public MovieFilterRequest(){}
    
    public Set<String> getGenres(){
        return genres;
    }
    public Double getMinRating() {
        return minRating;
    }
    public Double getGunnarsMinRating() {
        return gunnarsMinRating;
    }
}
