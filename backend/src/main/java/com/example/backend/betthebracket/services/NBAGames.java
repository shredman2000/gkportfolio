package com.example.backend.betthebracket.services;

import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NBAGames {

    @Value("${ODDS_Key}")
    private String apiKey;


    private final HttpClient client = HttpClient.newBuilder().build();

    /**
     * Fetches NBA odds data from the API and saves it to a JSON file.
     */
    public String fetchAndSaveNBAOdds() {
        try {
                String NBA_ODDS_URL =
                    "https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?" +
                    "apiKey=" + apiKey +
                    "&regions=us" +
                    "&markets=h2h" +
                    "&bookmakers=draftkings" +
                    "&oddsFormat=american";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(NBA_ODDS_URL))
                    .GET()
                    .header("Accept", "application/json")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Raw API response: " + response.body());

            if (response.statusCode() == 200) {
                //saveToFile("src/main/resources/nba_odds.json", response.body());
                return response.body();

            } else {
                throw new RuntimeException("Error fetching NBA odds: HTTP " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch NBA odds", e);
        }
    }

    private void saveToFile(String filePath, String data) throws IOException {
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(data);
        }
    }
}
