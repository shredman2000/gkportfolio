package com.example.backend.models;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
    private String dateRated;
    private String posterURL;

    public Movie() {}

    public Movie(Long id, String title, Set<Genre> genres, Double rating, Double gunnarsRating, int year, String dateRated, String posterURL) {
        this.id = id;
        this.title = title;
        this.genres = genres;
        this.rating = rating;
        this.gunnarsRating = gunnarsRating;
        this.year = year;
        this.dateRated = dateRated;
        this.posterURL = posterURL;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public Set<Genre> getGenres() { return genres; }
    public Double getRating() { return rating; }
    public Double getGunnarsRating() { return gunnarsRating; }
    public int getYear() { return year; }
    public String getDateRated() { return dateRated; }
    public String getPosterURL() { return posterURL; }


    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setGunnarsRating(Double gunnarsRating) { this.gunnarsRating = gunnarsRating; }
    public void setYear(int year) { this.year = year; }
    public void setDateRated(String dateRated) { this.dateRated = dateRated; }
    public void setPosterURL(String posterURL) { this.posterURL = posterURL; }
}
