package com.example.backend.betthebracket.services.finishedGames;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.services.GameResult;

/**
 * This class is to parse the scores of finished games and sort them so we can use that information
 * for betting and team advancements in the MM tournament bracket
 */
@Service
public class ScoresParser {

    // This method is responsible for parsing the scores from a JSON response.
    public static List<GameResult> parseScores(String responseBody) {

        List<GameResult> results = new ArrayList<>();


        // Convert the JSON response body into a JSONArray
        JSONArray scoresArray = new JSONArray(responseBody);

        // If there are no scores in the array, print a message and stop
        if (scoresArray.length() == 0) {
            System.out.println("No scores available.");
            return results;
        }

        // Iterate through each game in the scores array
        for (int i = 0; i < scoresArray.length(); i++) {
            // Get the current game as a JSONObject
            
            JSONObject game = scoresArray.getJSONObject(i);

            GameResult gameResult = new GameResult();

            // Extract the home team and away team names
            String homeTeam = game.getString("home_team");
            String awayTeam = game.getString("away_team");
            gameResult.setHomeTeam(homeTeam);
            gameResult.setAwayTeam(awayTeam);

            JSONArray scores = game.getJSONArray("scores");

            // Print the names of the teams playing the game
            System.out.println("\nGame: " + homeTeam + " vs. " + awayTeam);

            // Check if the game has scores and if the scores are in the expected format
            if (game.has("scores") && game.get("scores") instanceof JSONArray) {
                // Get the scores array for the current game

                // Ensure there are at least two scores (home and away)
                if (scores.length() >= 2) {
                    // Retrieve the score for the home and away teams (with default -1 if missing or invalid)
                    int homeScore = scores.optJSONObject(0).optInt("score", -1);
                    int awayScore = scores.optJSONObject(1).optInt("score", -1);

                    gameResult.setHomeScore(homeScore);
                    gameResult.setAwayScore(awayScore);
                    // Check if both scores are valid (non-negative)
                    if (homeScore >= 0 && awayScore >= 0) {
                        String winner;
                        // Determine and print the winner based on the scores
                        if (homeScore > awayScore) {
                            winner = homeTeam;
                        } 
                        else {
                            winner = awayTeam;
                        }
                        String matchupKey = homeTeam + " vs " + awayTeam;
                        gameResult.setWinner(winner);

                        //winners.put(matchupKey, winner);
                    
                    }
                } 
            }
            results.add(gameResult);

        }
        return results;
    }
    
}
