package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private int wpm;

    // Constructor must match class name
    public Score() {}

    public Score(String username, int wpm) {
        this.username = username;
        this.wpm = wpm;
    }

    // Getters and setters (optional but recommended)
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public int getWpm() { return wpm; }
    public void setWpm(int wpm) { this.wpm = wpm; }
}
