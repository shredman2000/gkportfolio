package com.example.backend.betthebracket.services;

import java.net.URL;
import java.time.OffsetDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.models.NBAGame;
import com.example.backend.betthebracket.repository.NBAGameRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NBAResultChecker {
    private final NBAGameRepository nbaGameRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${ODDS_Key}")
    private String apiKey;



    public NBAResultChecker (NBAGameRepository nbaGameRepository) {
        this.nbaGameRepository = nbaGameRepository;
    }

    /**
    * Parse the winners of past NBA games and check against the games in the db, update bets 
    */
    public void updateFinishedNBAGames() {
        String NBA_SCORES_URL =
            "https://api.the-odds-api.com/v4/sports/basketball_nba/scores/?" +
            "apiKey=" + apiKey +
            "&daysFrom=1";
        
        try {
            JsonNode root = mapper.readTree(new URL(NBA_SCORES_URL));
            for (JsonNode gameNode : root) {
                boolean completed = gameNode.get("completed").asBoolean();
                if (!completed) continue;

                String homeTeam = gameNode.get("home_team").asText();
                String awayTeam = gameNode.get("away_team").asText();
                String commenceTime = gameNode.get("commence_time").asText();

                OffsetDateTime dateTime = OffsetDateTime.parse(commenceTime);
                String gameDate = dateTime.toLocalDate().toString();

                int homeScore = -1, awayScore = -1;
                for (JsonNode scoreNode : gameNode.get("scores")) {
                    String teamName = scoreNode.get("name").asText();
                    int score = Integer.parseInt(scoreNode.get("score").asText());

                    if (teamName.equals(homeTeam)) homeScore = score;
                    else if (teamName.equals(awayTeam)) awayScore = score;
                }

                if (homeScore < 0 || awayScore < 0) continue;

                String winner = (homeScore > awayScore) ? homeTeam : awayTeam;


                Optional<NBAGame> foundGameInDB = nbaGameRepository.findByHomeTeamAndAwayTeamAndDate(homeTeam, awayTeam, gameDate);
                if (foundGameInDB.isPresent()) {
                    NBAGame nbaGame = foundGameInDB.get();
                    if (!"finished".equalsIgnoreCase(nbaGame.getStatus())) {
                        nbaGame.setWinner(winner);
                        nbaGame.setStatus("finished");
                        nbaGame.setHomeScore(homeScore);
                        nbaGame.setAwayScore(awayScore);
                        nbaGameRepository.save(nbaGame);
                        System.out.println("Updated game: " + homeTeam + " vs " + awayTeam + " — Winner: " + winner);
                    }
                }


            }   
        } 
        catch (Exception e) {
            System.err.println("Error fetching NBA results: " + e.getMessage());
        }
    }

}



