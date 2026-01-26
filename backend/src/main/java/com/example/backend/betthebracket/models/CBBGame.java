package com.example.backend.betthebracket.models;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name="cbb_games")
public class CBBGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String externalId;

    private String homeTeam;
    private String awayTeam;

    private Integer homeScore;
    private Integer awayScore;

    private Instant startTime;

    private Double homeOdds;
    private Double awayOdds;

    private String winner;

    private String status;

    public CBBGame() {}


    public CBBGame( 
                String homeTeam, 
                String awayTeam, 
                Instant startTime, 
                Integer homeScore, 
                Integer awayScore,
                String externalId
            ) {
                this.homeTeam = homeTeam;
                this.awayTeam = awayTeam;
                this.startTime = startTime;
                this.homeScore = homeScore;
                this.awayScore = awayScore;
                this.externalId = externalId;
    }

    // constructor for use in 
    public CBBGame(Long id, 
                String homeTeam, 
                String awayTeam,   
                Instant startTime, 
                Double homeOdds, 
                Double awayOdds,
                String externalId
            ) {
                this.id = id;
                this.homeTeam = homeTeam;
                this.awayTeam = awayTeam;
                this.homeScore = null;
                this.awayScore = null;
                this.startTime = startTime;
                this.homeOdds = homeOdds;
                this.awayOdds = awayOdds;
                this.winner = null;
                this.status = "scheduled";
                this.externalId = externalId;
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

    public String getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }

    public Integer getHomeScore() {
        return homeScore;
    }

    public void setHomeScore(Integer homeScore) {
        this.homeScore = homeScore;
    }

    public Integer getAwayScore() {
        return awayScore;
    }

    public void setAwayScore(Integer awayScore) {
        this.awayScore = awayScore;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Double getHomeOdds() {
        return homeOdds;
    }

    public void setHomeOdds(Double homeOdds) {
        this.homeOdds = homeOdds;
    }

    public Double getAwayOdds() {
        return awayOdds;
    }

    public void setAwayOdds(Double awayOdds) {
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

    public String getExternalId() {
        return externalId;
    }
    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }
}
