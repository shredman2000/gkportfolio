package com.example.backend.models;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "movie")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "movie_genre",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    public void addGenre(Genre genre) { genres.add(genre); }

    private Double rating;
    private Double gunnarsRating;
    private int year;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "date_rated", columnDefinition = "date")
    private LocalDate dateRated;
    private String posterURL;
    private String backdropURL;

    private int movieId;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<StreamingService> services = new HashSet<>();

    public Movie() {}

    public Movie(Long id, String title, Set<Genre> genres, Double rating, Double gunnarsRating, int year, LocalDate dateRated, String posterURL, String synopsis, String backdropURL,int movieId, Set<StreamingService> services) {
        this.id = id;
        this.title = title;
        this.genres = genres;
        this.rating = rating;
        this.gunnarsRating = gunnarsRating;
        this.year = year;
        this.dateRated = dateRated;
        this.posterURL = posterURL;
        this.synopsis = synopsis;
        this.backdropURL = backdropURL;
        this.movieId = movieId;
        this.services = services;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public Set<Genre> getGenres() { return genres; }
    public Double getRating() { return rating; }
    public Double getGunnarsRating() { return gunnarsRating; }
    public int getYear() { return year; }
    public LocalDate getDateRated() { return dateRated; }
    public String getPosterURL() { return posterURL; }
    public String getSynopsis() { return synopsis; }
    public String getBackdropURL() { return backdropURL; }
    public int getMovieId() { return movieId; }
    public Set<StreamingService> getStreamingServices() { return services; } 


    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setGunnarsRating(Double gunnarsRating) { this.gunnarsRating = gunnarsRating; }
    public void setYear(int year) { this.year = year; }
    public void setDateRated(LocalDate dateRated) { this.dateRated = dateRated; }
    public void setPosterURL(String posterURL) { this.posterURL = posterURL; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }
    public void setBackdropURL(String backdropURL) {this.backdropURL = backdropURL; }
    public void setMovieId(int movieId) { this.movieId = movieId; }
    public void setStreamingServices(Set<StreamingService> services) { this.services = services; }
    public void addStreamingService(StreamingService service) { services.add(service); }
}
