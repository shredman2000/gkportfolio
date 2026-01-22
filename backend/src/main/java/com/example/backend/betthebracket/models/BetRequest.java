package com.example.backend.betthebracket.models;


/**
 * Testing for useing authTOken
 */
public class BetRequest {

    private String authToken;
    private Long gameId;
    private String betType;
    private double amount;
    private String odds;
    private String teamPicked;
    private String sport;
    private double potentialPay;


    public String getSport() {
        return sport;
    }
    public void setSport(String sport) {
        this.sport = sport;
    }

    public double getPotentialPay() {
        return potentialPay;
    }
    public void setPotentialPay(double potentialPay) {
        this.potentialPay = potentialPay;
    }
    public String getAuthToken() {
        return authToken;
    }
    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public Long getGameId() {
        return gameId;
    }
    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getBetType() {
        return betType;
    }
    public void setBetType(String betType) {
        this.betType = betType;
    }

    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getOdds() {
        return odds;
    }
    public void setOdds(String odds) {
        this.odds = odds;
    }

    public String getTeamPicked() {
        return teamPicked;
    }
    public void setTeamPicked(String teamPicked) {
        this.teamPicked = teamPicked;
    }
}
