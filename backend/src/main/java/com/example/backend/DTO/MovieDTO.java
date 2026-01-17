package com.example.backend.DTO;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.backend.models.Genre;
import com.example.backend.models.Movie;
import com.example.backend.models.StreamingService;

/**
 * Single movie object to be returned
 */
public class MovieDTO{
    private Long id;
    private String title;
    private Set<String> genres = new HashSet<>();
    private Set<StreamingService> streamingServices = new HashSet<>();
    private Double rating;
    private Double gunnarsRating;
    private int year;
    private LocalDate dateRated;
    private String posterURL;
    private String synopsis;
    private String backdropURL;
    private int movieId;




    public MovieDTO(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.rating = movie.getRating();
        //this.genres = movie.getGenres();
        this.gunnarsRating = movie.getGunnarsRating();
        this.year = movie.getYear();
        this.dateRated = movie.getDateRated();
        this.posterURL = movie.getPosterURL();
        this.synopsis = movie.getSynopsis();
        this.backdropURL = movie.getBackdropURL();
        this.movieId = movie.getMovieId();
        this.streamingServices = movie.getStreamingServices();
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
    public LocalDate getDateRated() {
        return dateRated;
    }
    public String getPosterURL() {
        return posterURL;
    }
    public String getSynopsis() {
        return synopsis;
    }
    public String getBackdropURL() {
        return backdropURL;
    }
    public int getMovieId() {
        return movieId;
    }

    public Set<StreamingService> getStreamingServices() {
        return streamingServices;
    }
}
