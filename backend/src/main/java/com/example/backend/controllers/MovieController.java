package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import com.example.backend.models.Movie;
import com.example.backend.repositories.MovieRepository;
import com.example.backend.DTO.MovieListResponse;
import com.example.backend.DTO.MovieDTO;
import com.example.backend.DTO.MovieFilterRequest;
import com.example.backend.services.MovieService;


@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {


    private final MovieService movieService;


    // Constructor
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/searchmovies")
    public ResponseEntity<MovieListResponse> getMovies(@RequestBody MovieFilterRequest filters, Pageable pageable) {

        Page<Movie> page = movieService.searchMovies(filters, pageable);
        
        List<MovieDTO> movieDTOList = page.getContent().stream().map(MovieDTO::new).toList();

        MovieListResponse response = new MovieListResponse(movieDTOList, page.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recentlywatched")
    public ResponseEntity<MovieListResponse> getRecentlyWatched() {
        List<Movie> moviesList = movieService.getRecentlyWatched(15);

        List<MovieDTO> movieDTOList = moviesList.stream().map(MovieDTO::new).toList();

        MovieListResponse response = new MovieListResponse(movieDTOList, 15);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/favoritemovies")
    public ResponseEntity<MovieListResponse> getFavoriteMovies() {
        List<Movie> moviesList = movieService.getFavoriteMovies(15);
        
        List<MovieDTO> movieDTOList = moviesList.stream().map(MovieDTO::new).toList();

        MovieListResponse response = new MovieListResponse(movieDTOList, 15);

        return ResponseEntity.ok(response);
    }

    
}
