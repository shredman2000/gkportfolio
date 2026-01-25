package com.example.backend.betthebracket.services.finishedGames;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.services.GameResult;

/**
 * This class is responsible for fetching basketball game odds and scores from an API,
 * displaying the odds for a specific date range, and determining the winners of the games.
 */
@Service
public class FinishedGameResult {

    // API Key for authentication with the odds API
    private static final String API_KEY = "cdcf15d4f18fbc21fd5f3d575ddb884c"; 


    // URL for fetching the odds data (with date range parameters)
    private static final String ODDS_URL = "https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=" + API_KEY
            + "&regions=us&markets=h2h,spreads&oddsFormat=american"
            + "&commenceTimeFrom=2025-04-01T00:00:00Z&commenceTimeTo=2025-04-25T23:59:59Z";

    // URL for fetching the scores data (with date range parameters)
    private static final String SCORES_URL = "https://api.the-odds-api.com/v4/sports/basketball_ncaab/scores/?apiKey=" + API_KEY
            + "&commenceTimeFrom=2025-04-01T00:00:00Z&commenceTimeTo=2025-04-25T23:59:59Z";



    private final HttpClient client = HttpClient.newHttpClient();



    
    public List<GameResult> fetchScoresAndDetermineWinners(boolean useMocks, TournamentRound round) {
        try {
            String json;

            if (useMocks) {
                json = loadMockJson(round);
                return ScoresParser.parseScores(json);
            }
            else {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(SCORES_URL))  // Set the URI to the odds URL
                        .GET()  // Use the GET method
                        .header("Accept", "application/json")  // Set the header to accept JSON response
                        .build();

                
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                

                if (response.statusCode() != 200) {
                    return List.of();
                }
                json = response.body();
            }
            
            // Leave this for fixing errors in bracket
            //String json = Files.readString(Paths.get("src/main/resources/static/Championshipmock.json"));
            return ScoresParser.parseScores(json);
        }
        catch (Exception e){
            e.printStackTrace();
        }
            // return empty map on failure
            return List.of(); 
    }



    /**
     * Fetches the odds data from the API for the given date range and calls the GameParser to display it.
     * 
     * @param client The HttpClient used for making the HTTP request.
     * @throws Exception if there is an error during the HTTP request.
     */
    private static void fetchOdds(HttpClient client) throws Exception {
        // Create an HTTP request to fetch odds data
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ODDS_URL))  // Set the URI to the odds URL
                .GET()  // Use the GET method
                .header("Accept", "application/json")  // Set the header to accept JSON response
                .build();

        // Send the request and store the response
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // If the response is successful (status code 200), parse and display the odds
        if (response.statusCode() == 200) {
            System.out.println("Odds Data (March 12th):");
            GameParser.parseOdds(response.body());  // Pass the response body to GameParser for processing
        } else {
            // If the request fails, print the status code
            System.err.println("Failed to fetch odds. Status code: " + response.statusCode());
        }
    }
    
    public enum TournamentRound {
        ROUND_OF_64,
        ROUND_OF_32,
        SWEET_16,
        ELITE_8,
        FINAL_4,
        CHAMPIONSHIP
    }

    private String loadMockJson(TournamentRound round) throws IOException {
        String fileName = switch (round) {
            case ROUND_OF_64 -> "roundof64mock.json";
            case ROUND_OF_32 -> "roundof32mock.json";
            case SWEET_16 -> "roundof16mock.json";
            case ELITE_8 -> "roundof8mock.json";
            case FINAL_4 -> "roundof4mock.json";
            case CHAMPIONSHIP -> "championshipmock.json";
        };

        ClassPathResource resource =
            new ClassPathResource("static/" + fileName);

        return new String(resource.getInputStream().readAllBytes());
    }

}

