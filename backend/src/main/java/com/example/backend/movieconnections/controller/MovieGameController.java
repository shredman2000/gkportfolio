package com.example.backend.movieconnections.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.backend.movieconnections.entity.Clue;
import com.example.backend.movieconnections.entity.MovieGame;
import com.example.backend.movieconnections.entity.GameMovie;
import com.example.backend.movieconnections.repository.MovieGameRepository;

@RestController
@RequestMapping("/api/movieconnections")
@CrossOrigin(origins = "*")
public class MovieGameController {
    
    @Autowired
    private MovieGameRepository movieGameRepository;

    @Value("${admin.user}")
    private String adminUser;

    @Value("${admin.password}")
    private String adminPassword;

    @GetMapping
    public String getTest() {
        return "GET WORKS";
    }


    @PostMapping("/create")
    public ResponseEntity<String> createGame(@RequestBody Map<String, Object> request)  {
        String dateStr = (String) request.get("goLiveDate");

        LocalDate goLiveDate = LocalDate.parse(dateStr);

        if (movieGameRepository.existsByDateToGoLive(goLiveDate)) {
            return ResponseEntity.badRequest().body("A game is already scheduled for that date");
        }

        MovieGame game = new MovieGame();
        game.setDateToGoLive(goLiveDate);

        for (int i = 0; i < 4; i++) {
            String title = (String) request.get("title" + i);
            @SuppressWarnings("unchecked")
            List<String> clueUrls = (List<String>) request.get("clues" + i);
            
            GameMovie movie = new GameMovie(title);
        
            for (String url : clueUrls) {
                Clue clue = new Clue(url);

                movie.addClue(clue);
            }
            game.addMovie(movie);
        }

        movieGameRepository.save(game);

        return ResponseEntity.ok("Game Created");

    }

    @PostMapping("/getGame")
    public ResponseEntity<MovieGame> getGame(@RequestBody Map<String,String> request) {
        System.out.println(request);
        String gameIdStr = request.get("gameId");


        Optional<MovieGame> gameOpt;
        if (gameIdStr == null) {
            gameOpt = movieGameRepository.findTopByOrderByGameIdDesc();
        }
        else {
            Long gameId = Long.parseLong(gameIdStr);
            gameOpt = movieGameRepository.findByGameId(gameId);
        }

        if (gameOpt.isEmpty()) { 
            return ResponseEntity.badRequest().body(null);
        }


        MovieGame game = gameOpt.get();

        return ResponseEntity.ok(game);
    }

    @PostMapping("/adminSignIn")
    public ResponseEntity<Boolean> adminSignIn(@RequestBody Map<String, String> request) {

        String user = request.get("username");
        String pass = request.get("password");

        if (user.equals(adminUser) && pass.equals(adminPassword)) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.badRequest().body(false);

    }
}
