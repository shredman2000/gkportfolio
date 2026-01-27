package com.example.backend.betthebracket.services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OddsFetcher {
    // API key for authentication
    @Value("${ODDS_Key}")
    private String apiKey;
    // URL to fetch NCAA basketball game odds from The Odds API


    private final HttpClient client = HttpClient.newBuilder().build();

    public String fetchOddsData(String gameType) {
        String URL = "";
        switch (gameType) {
            case "cbb":
                URL = "https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=" + apiKey
                    + "&daysFrom=1" // Fetch games starting from March 12th, 2025
                    + "&regions=us" // Get US-based sportsbooks
                    + "&markets=h2h"; // Get head-to-head odds (moneyline)
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
                // Parse the JSON response to extract odds and matchups
                //OddsAPIParser.parseGames(response.body());
                return response.body();

            } else {
                // Print error if the response is not successful

                System.err.println("Odds api failed with status: " + response.statusCode());
                return null;
                
            }
        } 
        catch (Exception e) {
            System.err.println("Odds API exception: " + e.getMessage());
            return null;
        
        }

    }


    /*
    // This is a placeholder method for doing bets without having access to the database
    // This will be changed to do it on our website and also the api call will store the data in the database
    // The database will also store the betting data for each person
    // Method to interact with the user for betting
    private static void interactWithUser() {
        Scanner scanner = new Scanner(System.in);
        Betting bettingSystem = OddsAPIParser.getBettingSystem(); // Get betting system with matchups

        while (true) {
            System.out.println("\nWould you like to place a bet? (yes/no)");
            String input = scanner.nextLine().trim().toLowerCase();

            if (input.equals("no")) {
                System.out.println("Exiting...");
                break; // Exit loop
            } else if (input.equals("yes")) {
                bettingSystem.displayMatchups(); // Show available matchups
                
                System.out.println("Enter the matchup number:");
                int matchupIndex = scanner.nextInt();
                scanner.nextLine(); // Consume newline

                System.out.println("Enter the team name you want to bet on:");
                String team = scanner.nextLine();

                System.out.println("Enter your bet amount:");
                double amount = scanner.nextDouble();
                scanner.nextLine(); // Consume newline

                bettingSystem.placeBet(matchupIndex, team, amount);
            } else {
                System.out.println("Invalid input. Please type 'yes' or 'no'.");
            }
        }

        scanner.close(); // Close scanner after use
    }*/
}

