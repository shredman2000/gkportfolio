package com.example.backend.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.example.backend.models.Movie;
import com.example.backend.repositories.MovieRepository;
import com.example.backend.DTO.MovieListResponse;
import com.example.backend.DTO.MovieDTO;
import com.example.backend.DTO.MovieFilterRequest;
import com.example.backend.services.MovieService;
import com.example.backend.specifications.MovieSpecification;


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
    public ResponseEntity<MovieListResponse> getMovies(@RequestBody Map<String, Object> params) {

        String genre = params.get("genre") != null ? params.get("genre").toString() : null;
        Double minRating = params.containsKey("minRating") ? ((Number) params.get("minRating")).doubleValue() : null;
        Double gunnarsMinRating = params.containsKey("gunnarsMinRating") ? ((Number) params.get("gunnarsMinRating")).doubleValue() : null;

        int page = params.containsKey("page") ? ((Number) params.get("page")).intValue() : 1;
        int limit = params.containsKey("limit") ? ((Number) params.get("limit")).intValue() : 30;

        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<Movie> moviePage = movieService.searchMovies(genre, minRating, gunnarsMinRating, pageable);

        
        List<MovieDTO> movieDTOList = moviePage.getContent().stream().map(MovieDTO::new).toList();

        MovieListResponse response = new MovieListResponse(movieDTOList, moviePage.getTotalElements(), moviePage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recentlywatched")
    public ResponseEntity<MovieListResponse> getRecentlyWatched() {
        List<Movie> moviesList = movieService.getRecentlyWatched(15);

        List<MovieDTO> movieDTOList = moviesList.stream().map(MovieDTO::new).toList();

        MovieListResponse response = new MovieListResponse(movieDTOList, 15, 1);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/favoritemovies")
    public ResponseEntity<MovieListResponse> getFavoriteMovies() {
        List<Movie> moviesList = movieService.getFavoriteMovies(15);
        
        List<MovieDTO> movieDTOList = moviesList.stream().map(MovieDTO::new).toList();

        MovieListResponse response = new MovieListResponse(movieDTOList, 15, 1);

        return ResponseEntity.ok(response);
    }

    
}
