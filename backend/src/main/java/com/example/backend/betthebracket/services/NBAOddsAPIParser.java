package com.example.backend.betthebracket.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.models.NBAGame;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NBAOddsAPIParser {

    private static final String FILE_PATH = "src/main/resources/nba_odds.json";

    public List<NBAGame> parseNBAOddsFromFile(String jsonData) {
        List<NBAGame> gamesList = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();

        try {
            //String jsonData = Files.readString(Paths.get(FILE_PATH));
            JsonNode rootArray = mapper.readTree(jsonData);

            for (JsonNode gameNode : rootArray) {
                String homeTeam = gameNode.get("home_team").asText();
                String awayTeam = gameNode.get("away_team").asText();
                //String startTime = gameNode.get("commence_time").asText().replace("Z", "");
                OffsetDateTime offsetDateTime = OffsetDateTime.parse(gameNode.get("commence_time").asText());
                LocalDateTime gameStartTime = offsetDateTime.toLocalDateTime();


                JsonNode bookmakers = gameNode.get("bookmakers");
                for (JsonNode bookmaker : bookmakers) {
                    String bookmakerName = bookmaker.get("title").asText();
                    if ("DraftKings".equalsIgnoreCase(bookmakerName)) {
                        JsonNode markets = bookmaker.get("markets");
                        if (markets.size() > 0) {
                            JsonNode outcomes = markets.get(0).get("outcomes");

                            double homeOdds = -1;
                            double awayOdds = -1;

                            for (JsonNode outcome : outcomes) {
                                String team = outcome.get("name").asText();
                                double odds = outcome.get("price").asDouble();

                                if (team.equalsIgnoreCase(homeTeam)) {
                                    homeOdds = odds;
                                } else if (team.equalsIgnoreCase(awayTeam)) {
                                    awayOdds = odds;
                                }
                            }

                            if (homeOdds != -1 && awayOdds != -1) {
                                NBAGame nbaGame = new NBAGame(
                                    homeTeam, 
                                    awayTeam, 
                                    0, 
                                    0, 
                                    homeOdds, 
                                    awayOdds, 
                                    gameStartTime.toLocalDate().toString(),
                                    gameStartTime.toLocalTime().toString(),
                                    null,
                                    "scheduled");

                                gamesList.add(nbaGame);
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse NBA odds from file", e);
        }

        return gamesList;
    }
}
