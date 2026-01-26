package com.example.backend.betthebracket.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.models.Game;
import com.example.backend.betthebracket.services.finishedGames.FinishedGameResult.TournamentRound;
/**
 * Parses JSON data from The Odds API and stores matchups in the Betting system.
 */
@Service
public class OddsAPIParser {
    //private static Betting bettingSystem = new Betting(); // Instance of Betting to store parsed matchups

    /**
     * Parses the JSON response from The Odds API and adds games to the Betting system.
     * 
     * @param responseBody The raw JSON string returned by The Odds API.
     */
    public List<ParsedGameOdds> parseGames(String responseBody) {
        List<ParsedGameOdds> gamesList = new ArrayList<>();
        
        // Convert the response body into a JSON array (list of games)
        JSONArray gamesArray = new JSONArray(responseBody);

        // Set to keep track of matchups to avoid duplicates
        Set<Matchup> processedMatchups = new HashSet<>();

        // Iterate through each game in the JSON array
        for (int i = 0; i < gamesArray.length(); i++) {
            JSONObject game = gamesArray.getJSONObject(i); // Get each game as a JSON object

            // Extract home and away team names
            String homeTeam = game.getString("home_team");
            String awayTeam = game.getString("away_team");

            // Extract and convert game start time
            String startTime = game.getString("commence_time"); // Example: "2025-03-12T23:00:57Z"
            Instant gameStartTime = Instant.parse(startTime); // Remove 'Z' and convert to LocalDateTime

            // Create a Matchup object to check for duplicates
            Matchup matchup = new Matchup(homeTeam + " vs " + awayTeam, gameStartTime);

            // If the matchup has already been processed, skip it
            if (processedMatchups.contains(matchup)) continue;

            // Mark this matchup as processed by adding it to the set
            processedMatchups.add(matchup);

            // Extract the list of bookmakers (sportsbooks)
            JSONArray bookmakers = game.getJSONArray("bookmakers");

            // Iterate through all available bookmakers
            for (int j = 0; j < bookmakers.length(); j++) {
                JSONObject bookmaker = bookmakers.getJSONObject(j);
                String bookmakerName = bookmaker.getString("title"); // Example: "DraftKings"

                // We only want to extract odds from DraftKings
                if ("DraftKings".equalsIgnoreCase(bookmakerName)) {
                    JSONArray markets = bookmaker.getJSONArray("markets"); // Extract available betting markets

                    // Ensure there is at least one market available
                    if (markets.length() > 0) {
                        JSONObject market = markets.getJSONObject(0); // Get the first market (moneyline odds)

                        JSONArray outcomes = market.getJSONArray("outcomes"); // List of teams with their odds

                        double homeOdds = -1; // Default value for home team odds
                        double awayOdds = -1; // Default value for away team odds

                        // Iterate through all betting outcomes (teams and their odds)
                        for (int k = 0; k < outcomes.length(); k++) {
                            JSONObject outcome = outcomes.getJSONObject(k);
                            String team = outcome.getString("name"); // Team name (e.g., "Baylor Bears")
                            double odds = outcome.getDouble("price"); // Betting odds for that team

                            // Assign odds to the correct team
                            if (team.equalsIgnoreCase(homeTeam)) {
                                homeOdds = odds;
                            } else if (team.equalsIgnoreCase(awayTeam)) {
                                awayOdds = odds;
                            }
                        }

                        // Only add the matchup if both teams have valid odds
                        // NA and seed 1000 because they shouldnt be used.
                        if (homeOdds > 0 && awayOdds > 0) {
                            ParsedGameOdds gameObject = new ParsedGameOdds(homeTeam, awayTeam, Instant.parse(game.getString("commence_time")), homeOdds, awayOdds);
                            gamesList.add(gameObject);
                        }
                    }
                }
            }
        }
        return gamesList;
    }

    /**
     * Inner class to represent a unique matchup (used for avoiding duplicate matchups).
     */
    public static class Matchup {
        private String matchup; // Example: "Baylor Bears vs Kansas St Wildcats"
        private Instant startTime; // Start time of the game

        /**
         * Constructor to initialize a matchup object.
         * 
         * @param matchup   String representation of the matchup (e.g., "Team A vs Team B").
         * @param startTime The start time of the game.
         */
        public Matchup(String matchup, Instant startTime) {
            this.matchup = matchup;
            this.startTime = startTime;
        }

        /**
         * Compares two Matchup objects to check if they are the same.
         * 
         * @param obj The object to compare.
         * @return True if the matchups have the same teams and start time, false otherwise.
         */
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true; // If comparing the same object, return true
            if (obj == null || getClass() != obj.getClass()) return false; // Ensure same class type
            Matchup matchup1 = (Matchup) obj;
            return this.matchup.equals(matchup1.matchup) && this.startTime.equals(matchup1.startTime);
        }

        /**
         * Generates a unique hash code for this matchup.
         * 
         * @return The hash code value.
         */
        @Override
        public int hashCode() {
            return 31 * matchup.hashCode() + startTime.hashCode();
        }
    }

    /**
     * Getter method to retrieve the Betting system instance (used in OddsFetcher).
     * 
     * @return The Betting system with all parsed matchups.
     */
   /* public static Betting getBettingSystem() {
        return bettingSystem;
    }*/

    public class ParsedGameOdds {
        private String homeTeam;
        private String awayTeam;
        private Instant startTime;
        private Double homeOdds;
        private Double awayOdds;
        private Integer homeScore;
        private Integer awayScore;

        public ParsedGameOdds(String homeTeam, String awayTeam, Instant startTime, Double homeOdds, Double awayOdds) {
            this.homeTeam = homeTeam;
            this.awayTeam = awayTeam;
            this.startTime = startTime;
            this.homeOdds = homeOdds;
            this.awayOdds = awayOdds;
        }

        public void setHomeTeam(String homeTeam) { this.homeTeam = homeTeam; }
        public void setAwayTeam(String awayTeam) { this.awayTeam = awayTeam; }
        public void setStartTime(Instant startTime) { this.startTime = startTime; }
        public void setHomeOdds(Double homeOdds) { this.homeOdds = homeOdds; }
        public void setAwayOdds(Double awayOdds) { this.awayOdds = awayOdds; }
        public void setHomeScore(Integer homeScore) { this.homeScore = homeScore; }
        public void setAwayScore(Integer awayScore) { this.awayScore = awayScore; }

        public String getHomeTeam() { return homeTeam; }
        public String getAwayTeam() { return awayTeam; }
        public Instant getStartTime() { return startTime; }
        public Double getHomeOdds() { return homeOdds; }
        public Double getAwayOdds() { return awayOdds; }
        public Integer getHomeScore() { return homeScore; }
        public Integer getAwayScore() { return awayScore; }
    }
}
