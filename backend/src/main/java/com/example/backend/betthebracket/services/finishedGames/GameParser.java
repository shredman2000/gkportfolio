package com.example.backend.betthebracket.services.finishedGames;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class is responsible for parsing the odds data from a JSON response.
 * It filters and displays only the odds provided by the "DraftKings" bookmaker.
 */
public class GameParser {

    /**
     * Parses the odds data from the JSON response and displays only DraftKings odds.
     *
     * @param responseBody The raw JSON string returned by the odds API.
     */
    public static void parseOdds(String responseBody) {
        // Convert the raw JSON response into a JSONArray of games
        JSONArray gamesArray = new JSONArray(responseBody);

        // If no games are found, display a message and stop
        if (gamesArray.length() == 0) {
            System.out.println("No odds available.");
            return;
        }

        // Loop through each game in the games array
        for (int i = 0; i < gamesArray.length(); i++) {
            // Get the details of the current game (home and away teams)
            JSONObject game = gamesArray.getJSONObject(i);
            
            // Extract home and away team names
            String homeTeam = game.getString("home_team");
            String awayTeam = game.getString("away_team");

            // Display the teams that are playing in this game
            System.out.println("\nGame: " + homeTeam + " vs. " + awayTeam);

            // Get the array of bookmakers for the current game
            JSONArray bookmakers = game.getJSONArray("bookmakers");

            // Flag to check if DraftKings odds are found for this game
            boolean draftKingsFound = false;

            // Loop through the list of bookmakers to find DraftKings
            for (int j = 0; j < bookmakers.length(); j++) {
                JSONObject bookmaker = bookmakers.getJSONObject(j);
                String bookmakerName = bookmaker.getString("title");

                // Check if the bookmaker is DraftKings
                if (bookmakerName.equalsIgnoreCase("DraftKings")) {
                    // Set flag to true when DraftKings is found
                    draftKingsFound = true;
                    System.out.println("Bookmaker: " + bookmakerName);

                    // Get the array of betting markets for this bookmaker
                    JSONArray markets = bookmaker.getJSONArray("markets");

                    // Loop through each market (e.g., Moneyline, Point Spread, etc.)
                    for (int k = 0; k < markets.length(); k++) {
                        JSONObject market = markets.getJSONObject(k);
                        String marketKey = market.getString("key");
                        System.out.println("Market: " + marketKey);

                        // Get the outcomes for this market (team names and odds)
                        JSONArray outcomes = market.getJSONArray("outcomes");

                        // Loop through each outcome (team and odds)
                        for (int m = 0; m < outcomes.length(); m++) {
                            JSONObject outcome = outcomes.getJSONObject(m);
                            String team = outcome.getString("name");

                            // Safely parse the odds price for the team, default to "N/A" if missing
                            String price = outcome.opt("price") != null 
                                    ? String.valueOf(outcome.opt("price")) 
                                    : "N/A";

                            // Display the team's odds for this market
                            System.out.println(team + " odds: " + price);
                        }
                    }
                }
            }

            // If no DraftKings data was found, inform the user
            if (!draftKingsFound) {
                System.out.println("DraftKings data not available for this game.");
            }
        }
    }
}
