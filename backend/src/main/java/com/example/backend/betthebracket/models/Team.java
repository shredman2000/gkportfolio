package com.example.backend.betthebracket.models;

// jpa import, for talking to the database
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // tells jpa that this is a table 
@Table(name = "teams") // necessary for mapping this class --> teams table in MySQL
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This is for auto incrementing values for identities
    private Long id;

    private String teamName;
    private int seed;
    private String logoUrl;  // Added logo URL (if we want, we can remove this later)
    private String conference;  // Added conference
    private int wins;  // Added team record (wins)
    private int losses;  // Added team record (losses)

    // Default constructor
    public Team() {}

    // Constructor with additional fields
    public Team(String teamName, int seed, String logoUrl, String conference, int wins, int losses) {
        this.teamName = teamName;
        this.seed = seed;
        this.logoUrl = logoUrl;
        this.conference = conference;
        this.wins = wins;
        this.losses = losses;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setSeed(int seed) {
        this.seed = seed;
    }

    public int getSeed() {
        return seed;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setConference(String conference) {
        this.conference = conference;
    }

    public String getConference() {
        return conference;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getWins() {
        return wins;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public int getLosses() {
        return losses;
    }

    // Additional method for printing team details
    public String printTeamDetails() {
        return "Team: " + teamName + "\n" +
               "Seed: " + seed + "\n" +
               "Conference: " + conference + "\n" +
               "Record: " + wins + "-" + losses;
    }
}
