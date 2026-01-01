package com.example.backend.controllers;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.Score;
import com.example.backend.repositories.ScoreRepository;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "*")
public class ScoreController {

    @Autowired
    private ScoreRepository repository;

    // POST /api/scores
    @PostMapping
    public Score addScore(@RequestBody Score score) {
        return repository.save(score);
    }

    // GET /api/scores/rank?wpm=${wpm}
    @GetMapping("/rank")
    public Map<String, Double> getPercentile(@RequestParam int wpm) {
        List<Score> allScores = repository.findAll();
        double percent = 0.0;

        if (!allScores.isEmpty()) {
            long countBelow = allScores.stream().filter(score -> score.getWpm() < wpm).count();
            percent = (double) countBelow / allScores.size();
        }
        Map<String, Double> response = new HashMap<>();
        response.put("rank", Math.round(percent * 100.0) / 100.0);

        return response;
    }
}
