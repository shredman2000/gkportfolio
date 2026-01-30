package com.example.backend.betthebracket.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.betthebracket.models.CBBGame;
import com.example.backend.betthebracket.models.Game;
import com.example.backend.betthebracket.repository.GameRepository;
import com.example.backend.betthebracket.services.GameService;
import com.example.backend.betthebracket.services.UpdateBetsService;


/**
 * Controller class that exposes functionality to the frontend. 
 * WIP - needs more methods for retrieving other info.
 */
@CrossOrigin(origins = "*")
@RestController 
@RequestMapping("/api/betthebracket/games")
public class GameController {
    private final GameRepository gameRepository;
    private final GameService gameService;
    private final UpdateBetsService updateBetsService;

    
    public GameController(GameRepository gameRepository, UpdateBetsService updateBetsService, GameService gameService) {
        this.gameRepository = gameRepository;
        this.gameService = gameService;
        this.updateBetsService = updateBetsService;
    }


    @GetMapping
    public ResponseEntity<List<Game>> getGames() {
        List<Game> games = gameService.getGames();
        return ResponseEntity.ok(games);
    }



    // DONT USE, just once for creating round of 64 games. 
    @PostMapping("/populatebracket")
    public String oneTimePopulateBracket() {
        try {
            gameService.populateBracket();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "bracket populated";
    }

    @GetMapping("/fetchCBB")
    public List<CBBGame> fetchGamesFromAPI() {
        updateBetsService.settleCBBBets();
        List<CBBGame> cbbGames = gameService.getCBBGames();

        return cbbGames;
    }

    
    

    @PostMapping
    public String addGame(@RequestBody Game game) {
        if (game.getHomeTeam() == null) {
            return "Error: ";
        }
        //if (game.getDate() == null) game.setDate("TBD");
        if (game.getTime() == null) game.setTime("TBD");
        //if (game.getOdds() == null) game.setOdds("N/A");
        //if (game.getLocation() == null) game.setLocation("Unknown");

        gameRepository.save(game);
        return "Matchup between: " + game.getHomeTeam() + " and " + game.getAwayTeam();
    }
}