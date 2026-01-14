package com.example.backend.utility;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.backend.models.Genre;
import com.example.backend.models.Movie;
import com.example.backend.repositories.GenreRepository;
import com.example.backend.repositories.MovieRepository;
import com.opencsv.CSVReader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MovieParser implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private GenreRepository genreRepository;

    // for TMBD
    @Value("${TMBD_KEY}")
    private String apiKey;

    private Map<Integer, String> genreMap;

    // TMBD uses specific numbers for genres, retrieve them
    public void generateGenreMap() throws Exception {
        String url = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JSONObject json = new JSONObject(response.body());
            JSONArray genres = json.getJSONArray("genres");
            genreMap = new HashMap<>();
            for (int i = 0; i < genres.length(); i++) {
                JSONObject g = genres.getJSONObject(i);
                genreMap.put(g.getInt("id"), g.getString("name"));
            }
        }
        else {
            throw new RuntimeException("Failed to fetch genres, status: " + response.statusCode());
        }
    }

    public void addFields() throws Exception {
        
        List<Movie> movies = movieRepository.findAll();
        HttpClient client = HttpClient.newHttpClient();

        List<Movie> batch = new ArrayList<>();
        int batchSize = 50;


        for(Movie movie : movies) {

            // end if already has fields
            if (movie.getRating() != null && movie.getGenres() != null && movie.getPosterURL() != null) { continue; }

            String query = URLEncoder.encode(movie.getTitle(), StandardCharsets.UTF_8);
            String url = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + query + "&year=" + movie.getYear();
            try {
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 429) {
                    Thread.sleep(1000);
                    response = client.send(request, HttpResponse.BodyHandlers.ofString());
                }
                if (response.statusCode() == 200) {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode root = mapper.readTree(response.body());
                    JsonNode results = root.get("results");

                    if (results != null && results.size() > 0) {
                        JsonNode apiMovie = results.get(0); // use the first match
                        movie.setRating(apiMovie.get("vote_average").asDouble());
                        JsonNode posterNode = apiMovie.get("poster_path");
                        if (posterNode != null && !posterNode.isNull()) {
                            String posterPath = posterNode.asText(); 
                            if (posterPath != null && !posterPath.isEmpty()) {
                                movie.setPosterURL("https://image.tmdb.org/t/p/w500" + posterPath);
                            }
                        }

                        JsonNode genreIds = apiMovie.get("genre_ids");
                        
                        for (JsonNode genreId : genreIds) {
                            int id = genreId.asInt();

                            if (genreMap.containsKey(id)) {
                                String genreName = genreMap.get(id);

                                Genre genre = genreRepository.findByName(genreName).orElseGet(() -> genreRepository.save(new Genre(genreName)));

                                movie.addGenre(genre);
                            }
                        }

                        batch.add(movie);

                        if (batch.size() >= batchSize) {
                            movieRepository.saveAll(batch);
                            batch.clear();
                        }

                        Thread.sleep(150);
                    }

                }
                else {
                    System.out.println("Failed for " + movie.getTitle() + ", status: " + response.statusCode());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (!batch.isEmpty()) {
            movieRepository.saveAll(batch);
        }

        // TODO: remove
        System.out.println("Movie data update complete");

    }

    @Override
    public void run(String... args) throws Exception {

        if (movieRepository.count() > 0) {
            System.out.println("Movies already populated, skipping");
            return;
        }

        // parse data with gunnars ratings
        InputStream input = getClass().getResourceAsStream("/data/ratings.csv");
        CSVReader csvreader = new CSVReader(new InputStreamReader(input));

        List<Movie> ratedMovies = new ArrayList<>();
        String[] line;
        csvreader.readNext();
        while((line = csvreader.readNext()) != null) {
            Movie movie = new Movie();
            movie.setDateRated(LocalDate.parse(line[0]));
            movie.setTitle(line[1]);
            movie.setYear(Integer.parseInt(line[2]));
            movie.setRating(null);
            movie.setGunnarsRating(Double.parseDouble(line[4]) * 2);

            ratedMovies.add(movie);

        }
        movieRepository.saveAll(ratedMovies);
        csvreader.close();
        generateGenreMap();

        addFields();
    }
    




}
