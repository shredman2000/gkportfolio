package com.example.backend.DTO;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.backend.models.Genre;
import com.example.backend.models.Movie;

/**
 * Single movie object to be returned
 */
public class MovieDTO{
    private Long id;
    private String title;
    private Set<String> genres = new HashSet<>();
    private Double rating;
    private Double gunnarsRating;
    private int year;
    private String dateRated;
    private String posterURL;




    public MovieDTO(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.rating = movie.getRating();
        //this.genres = movie.getGenres();
        this.gunnarsRating = movie.getGunnarsRating();
        this.year = movie.getYear();
        this.dateRated = movie.getDateRated();
        this.posterURL = movie.getPosterURL();

        this.genres = movie.getGenres().stream()
                       .map(Genre::getGenre)
                       .collect(Collectors.toSet());

    }

    public Long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public Double getRating() {
        return rating;
    }
    public Set<String> getGenres() {
        return genres;
    }
    public Double getGunnarsRating() {
        return gunnarsRating;
    }
    public int getYear() {
        return year;
    }
    public String getDateRated() {
        return dateRated;
    }
    public String getPosterURL() {
        return posterURL;
    }
}
