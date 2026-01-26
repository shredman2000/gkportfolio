package com.example.backend.betthebracket.services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.models.CBBGame;
import com.example.backend.betthebracket.repository.CBBGameRepository;

@Service
public class ScoreFetcher {
    @Value("${ODDS_Key}")
    private String apiKey;

    private final CBBGameRepository cbbGameRepository;

    private final HttpClient client = HttpClient.newBuilder().build();

    public ScoreFetcher(CBBGameRepository cbbGameRepository) {
        this.cbbGameRepository = cbbGameRepository;
    }

    public void fetchScores(String gameType) {
        String URL = "";
        switch (gameType) {
            case "cbb":
                URL = "https://api.the-odds-api.com/v4/sports/basketball_ncaab/scores/?apiKey=" + apiKey
                    + "&daysFrom=1";
        }
        try {
            HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(URL))
                        .GET()
                        .header("Accept", "application/json") // Expecting JSON response
                        .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
             // Check if the response is successful (HTTP 200 OK)
             if (response.statusCode() == 200) {

                List<CBBGame> cbbGames = cbbGameRepository.findAll();
                JSONArray gamesArray = new JSONArray(response.body());

                for (int i = 0; i < gamesArray.length(); i++) {
                    JSONObject apiGame = gamesArray.getJSONObject(i);

                    CBBGame game = cbbGames.stream()
                        .filter(g -> (g.getHomeTeam().equals(apiGame.getString("home_team")) && g.getAwayTeam().equals(apiGame.getString("away_team"))) ||
                                (g.getHomeTeam().equals(apiGame.getString("away_team")) && g.getAwayTeam().equals(apiGame.getString("home_team"))))
                        .findFirst()
                        .orElse(null);

                    // update existing games
                    if (game != null) {

                        JSONArray scoresArray = apiGame.optJSONArray("scores");

                        int homeScore = 0;
                        int awayScore = 0;
                        if (scoresArray != null) {
                            for (int j = 0; j < scoresArray.length(); j++) {
                                JSONObject scoreOBJ = scoresArray.getJSONObject(j);
                                String teamName = scoreOBJ.getString("name");
                            
                                String scoreStr = scoreOBJ.optString("score", null);

                                Integer score = null;
                                if (scoreStr != null && !scoreStr.isEmpty()) {
                                    score = Integer.parseInt(scoreStr);
                                }

                                if (teamName.equals(game.getHomeTeam())) {
                                    homeScore = score;
                                }
                                else if (teamName.equals(game.getAwayTeam())) {
                                    awayScore = score;
                                }
                            }
                        }

                        Boolean finished = apiGame.getBoolean("completed");
                        if (finished) {
                            game.setStatus("finished");
                        }
                        else {
                            game.setStatus("scheduled");
                        }
                        if (finished) {
                            if (homeScore > awayScore) {
                                game.setWinner(apiGame.getString("home_team"));
                            }
                            else {
                                game.setWinner(apiGame.getString("away_team"));
                            }
                        }
                        game.setHomeScore(homeScore);
                        game.setAwayScore(awayScore);

                        cbbGameRepository.save(game);
                    }
                     // otherwise create a new game. 
                    else {
                        Instant startTime = Instant.parse(apiGame.getString("commence_time"));
                        
                        JSONArray scoresArray = apiGame.optJSONArray("scores");

                        Integer homeScore = null;
                        Integer awayScore = null;



                        if (scoresArray != null) {
                            for (int j = 0; j < scoresArray.length(); j++) {
                                JSONObject scoreOBJ = scoresArray.getJSONObject(j);
                                String teamName = scoreOBJ.getString("name");
                                String scoreStr = scoreOBJ.optString("score", null);

                                Integer score = null;

                                if (scoreStr != null && !scoreStr.isEmpty()) {
                                    score = Integer.parseInt(scoreStr);
                                }
                                if (teamName.equals(apiGame.getString("home_team"))) {
                                    homeScore = score;
                                }
                                else if (teamName.equals(apiGame.getString("away_team"))) {
                                    awayScore = score;
                                }
                            }
                        }

                        CBBGame newGame = new CBBGame(
                                apiGame.getString("home_team"),
                                apiGame.getString("away_team"),
                                startTime,
                                homeScore, 
                                awayScore

                        );
                        Boolean finished = apiGame.getBoolean("completed");
                        if (finished) {
                            newGame.setStatus("finished");
                        }
                        else {
                            newGame.setStatus("scheduled");
                        }

                        if (finished) {
                            if (homeScore > awayScore) {
                                newGame.setWinner(apiGame.getString("home_team"));
                            }
                            else {
                                newGame.setWinner(apiGame.getString("away_team"));
                            }
                        }
                        cbbGameRepository.save(newGame);

                    }
                }





            } else {
                // Print error if the response is not successful
                throw new RuntimeException("Error fetching odds: HTTP " + response.statusCode());
            }
        } 
        catch (Exception e) {
            throw new RuntimeException("Failed to fetch data", e);
        
        }
    }

}
