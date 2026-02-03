package com.example.backend.betthebracket.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.betthebracket.models.NBAGame;
import com.example.backend.betthebracket.repository.NBAGameRepository;
import com.example.backend.betthebracket.services.NBAOddsService;
import com.example.backend.betthebracket.services.NBAResultChecker;
import com.example.backend.betthebracket.services.UpdateBetsService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/betthebracket/nba")
public class NBAOddsController {

    private final NBAOddsService nbaOddsService;
    private final NBAGameRepository nbaGameRepository;
    private final NBAResultChecker nbaResultChecker;
    private final UpdateBetsService updateBetsService;

    public NBAOddsController(NBAOddsService nbaOddsService, NBAGameRepository nbaGameRepository, NBAResultChecker nbaResultChecker, UpdateBetsService updateBetsService) {
        this.nbaOddsService = nbaOddsService;
        this.nbaGameRepository = nbaGameRepository;
        this.nbaResultChecker = nbaResultChecker;
        this.updateBetsService = updateBetsService;
    }


    @GetMapping("/odds")
    public ResponseEntity<?> getNBAOdds() {
        // fetch from api, and store to db
        nbaOddsService.fetchAndParseNBAOdds();
        nbaResultChecker.updateFinishedNBAGames();
        updateBetsService.settleNBABets();
        List<NBAGame> games = nbaGameRepository.findAll();
        return ResponseEntity.ok(games);
        // fetch from db and retrun 
    }
}
