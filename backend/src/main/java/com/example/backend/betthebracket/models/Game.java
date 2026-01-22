package com.example.backend.betthebracket.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity // tells jpa that this is a table 
@Table(name = "games",
       uniqueConstraints = @UniqueConstraint(columnNames = {"home_team", "away_team", "round", "region"}))
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This is for auto incrementing values in for identities
    private Long id;

    private String round;

    private String region;

    private int seed1;
    private String homeTeam;
    // private int homeTeamId;    
    
    @Column(unique = true)
    private String bracketTag;
    
    private int bracketNum;

    private int seed2;
    private String awayTeam;
    private int awayScore;
    
    private String date;
    private String time;

    @Column(name = "home_odds")
    private double homeOdds; 

    @Column(name = "away_odds")
    private double awayOdds;

    private String winner;
    

    private String status; // added field

    public Game() {}

    public Game(String round, String region, int seed1, String homeTeam, int seed2, String awayTeam, String date, String time, double homeOdds, double awayOdds, String winner, String bracketTag, int bracketNum) {
        this.round = round;
        this.region = region;
        this.seed1 = seed1;
        this.homeTeam = homeTeam;
        this.seed2 = seed2;
        this.awayTeam = awayTeam;
        this.date = date;
        this.time = time;
        this.homeOdds = homeOdds;
        this.awayOdds = awayOdds;
        this.winner = winner; 
        this.status = "scheduled";
        this.bracketTag = bracketTag;
        this.bracketNum = bracketNum;
    }
    

    // constructor for when there is no winner yet
    public Game(String round, String region, int seed1, String homeTeam, int seed2, String awayTeam, String date, String time, double homeOdds, double awayOdds, String bracketTag, int bracketNum) {
        this.round = round;
        this.region = region;
        this.seed1 = seed1;
        this.homeTeam = homeTeam;
        this.seed2 = seed2;
        this.awayTeam = awayTeam;
        this.date = date;
        this.time = time;
        this.homeOdds = homeOdds;
        this.awayOdds = awayOdds;
        this.bracketTag = bracketTag;
        this.winner = null; 
        this.status = "scheduled";
        this.bracketNum = bracketNum;
    }


   // getters/setters

   public Long getId() {
        return id;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public double getAwayOdds() {
        return awayOdds;
    }

    public void setAwayOdds(double awayOdds) {
        this.awayOdds = awayOdds;
    }

    public double getHomeOdds() {
        return homeOdds;
    }

    public void setHomeOdds(double homeOdds) {
        this.homeOdds = homeOdds;
    }
    
    public String getRound() { 
        return round; 
    }
    
    public String getRegion() { 
        return region; 
    }
    
    public int getSeed1() { 
        return seed1; 
    }
    
    public int getSeed2() { 
        return seed2; 
    }

    public String getStatus() { 
        return status; 
    }

    public void setStatus(String status) { 
        this.status = status; 
    }
    public void setWinner(String winner) {
        this.winner = winner;
    }
    public String getWinner() {
        return winner;
    }

    public String getBracketTag() {
        return bracketTag;
    }

    public void setBracketTag() {
        this.bracketTag = bracketTag;
    }
    
    public int getBracketNum() {
        return this.bracketNum;
    }
    public void setBracketNum() {
        this.bracketNum = bracketNum;
    }
}
