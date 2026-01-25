package com.example.backend.betthebracket.services;

public class GameResult {
    private String homeTeam;
    private String awayTeam;
    private int homeScore;
    private int awayScore;
    private String winner;

    public GameResult() {};

    public GameResult(String homeTeam, String awayTeam, int homeScore, int awayScore, String winner) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.winner = winner;
    }

    public void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }
    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }
    public void setHomeScore(int homeScore) {
        this.homeScore = homeScore;
    }
    public void setAwayScore(int awayScore) {
        this.awayScore = awayScore;
    }
    public void setWinner(String winner) {
        this.winner = winner;
    }


    public String getHomeTeam() {
        return homeTeam;
    }
    public String getAwayTeam() {
        return awayTeam;
    }
    public int getHomeScore() {
        return homeScore;
    }
    public int getAwayScore() {
        return awayScore;
    }
    public String getWinner() {
        return winner;
    }
}
