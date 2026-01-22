package com.example.backend.betthebracket.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name = "nbagames")
public class NBAGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This is for auto incrementing values in for identities
    private Long id;

    private String homeTeam;
    private int homeScore;    


    private String awayTeam;
    private int awayScore;
    
    @Column(name = "date")
    private String date;

    private String time;

    @Column(name = "home_odds")
    private double homeOdds; 

    @Column(name = "away_odds")
    private double awayOdds;

    private String winner;
    

    private String status; // added field



    public NBAGame() {}

    public NBAGame(String homeTeam, String awayTeam, int homeScore, int awayScore, Double homeOdds, Double awayOdds, String date, String time, String winner, String status) {
        this.homeTeam = homeTeam;
        this.homeScore = homeScore;
        this.awayTeam = awayTeam;
        this.awayScore = awayScore;
        this.date = date;
        this.time = time;
        this.homeOdds = homeOdds;
        this.awayOdds = awayOdds;
        this.winner = winner;
        this.status = status;
    }


    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getHomeTeam() {
        return homeTeam;
    }
    
    public void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }
    
    public int getHomeScore() {
        return homeScore;
    }
    
    public void setHomeScore(int homeScore) {
        this.homeScore = homeScore;
    }
    
    public String getAwayTeam() {
        return awayTeam;
    }
    
    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }
    
    public int getAwayScore() {
        return awayScore;
    }
    
    public void setAwayScore(int awayScore) {
        this.awayScore = awayScore;
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
    
    public double getHomeOdds() {
        return homeOdds;
    }
    
    public void setHomeOdds(double homeOdds) {
        this.homeOdds = homeOdds;
    }
    
    public double getAwayOdds() {
        return awayOdds;
    }
    
    public void setAwayOdds(double awayOdds) {
        this.awayOdds = awayOdds;
    }
    
    public String getWinner() {
        return winner;
    }
    
    public void setWinner(String winner) {
        this.winner = winner;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }


}
