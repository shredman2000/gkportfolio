package com.example.backend.DTO;

public class MovieFilterRequest {
    private String genre;
    private Double minRating;
    private Double gunnarsMinRating;

    public MovieFilterRequest(){}
    
    public String getGenre(){
        return genre;
    }
    public Double getMinRating() {
        return minRating;
    }
    public Double getGunnarsMinRating() {
        return gunnarsMinRating;
    }
}
