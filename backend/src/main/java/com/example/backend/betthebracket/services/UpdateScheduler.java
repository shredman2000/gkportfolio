package com.example.backend.betthebracket.services;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class UpdateScheduler {
    
    private final NBAOddsService nbaOddsService;
    private final NBAResultChecker nbaResultChecker;
    private final UpdateBetsService updateBetsService;

    private final GameService gameService;
    private final OddsAPIParser oddsAPIParser;


    public UpdateScheduler(
        NBAOddsService nbaOddsService,
        NBAResultChecker nbaResultChecker,
        UpdateBetsService updateBetsService,
        GameService gameService,
        OddsAPIParser oddsAPIParser
    ) {
        this.nbaOddsService = nbaOddsService;
        this.nbaResultChecker = nbaResultChecker;
        this.updateBetsService = updateBetsService;
        this.gameService = gameService;
        this.oddsAPIParser = oddsAPIParser;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void runFullUpdate() {
        System.out.println(">>>>>>>>>>>>>>>>>RUNNING HOURLY SCHEDULED UPDATE");
        nbaOddsService.fetchAndParseNBAOdds();
        nbaResultChecker.updateFinishedNBAGames();
        updateBetsService.settleNBABets();
        gameService.updateGamesFromApi("cbb");
        gameService.updateScoresFromApi("cbb");
        updateBetsService.settleCBBBets();
    }
}
