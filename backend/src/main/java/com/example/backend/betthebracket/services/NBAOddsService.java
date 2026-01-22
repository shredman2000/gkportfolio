package com.example.backend.betthebracket.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.models.NBAGame;
import com.example.backend.betthebracket.repository.NBAGameRepository;

@Service
public class NBAOddsService {

    private final NBAGames nbaGames;
    private final NBAOddsAPIParser nbaOddsAPIParser;
    private final NBAGameRepository nbaGameRepository;

    public NBAOddsService(NBAGames nbaGames, NBAOddsAPIParser nbaOddsAPIParser, NBAGameRepository nbaGameRepository) {
        this.nbaGames = nbaGames;
        this.nbaOddsAPIParser = nbaOddsAPIParser;
        this.nbaGameRepository = nbaGameRepository;
    }

    /**
     * Fetches NBA odds from the API, saves to a file, and parses them into a list of Game objects.
     *
     * @return List of parsed Game objects with DraftKings odds.
     */
    public void fetchAndParseNBAOdds() {
        
        //List<NBAGame> gamesList = new ArrayList<>();

        // Step 1: Fetch odds as a JSON string
        String gamesString = nbaGames.fetchAndSaveNBAOdds();
        // Step 2: Parse String into game objects
        List<NBAGame> apiList = nbaOddsAPIParser.parseNBAOddsFromFile(gamesString);
        System.out.println("API games parsed: " + apiList.size());

        // get games already in the database
        List<NBAGame> dbGames = nbaGameRepository.findAll();

        // search for matching games to just update odds, score, and status
        for (NBAGame apiGame : apiList) {
            NBAGame matchedGame = dbGames.stream().filter(dbGame ->
                dbGame.getHomeTeam().equals(apiGame.getHomeTeam()) &&
                dbGame.getAwayTeam().equals(apiGame.getAwayTeam()) &&
                dbGame.getDate().equals(apiGame.getDate()))
                .findFirst().orElse(null);

            if (matchedGame != null) {
                matchedGame.setHomeOdds(apiGame.getHomeOdds());
                matchedGame.setAwayOdds(apiGame.getAwayOdds());
                matchedGame.setHomeScore(apiGame.getHomeScore());
                matchedGame.setAwayScore(apiGame.getAwayScore());
                matchedGame.setStatus(apiGame.getStatus());
                matchedGame.setWinner(apiGame.getWinner());


                // save updated game to db
                nbaGameRepository.save(matchedGame);
                
            } 
            else {
                // add game to db
                nbaGameRepository.save(apiGame);
                System.out.println("Saved new game: " + apiGame.getHomeTeam() + " vs " + apiGame.getAwayTeam());
            }
                

        }
    }
}

