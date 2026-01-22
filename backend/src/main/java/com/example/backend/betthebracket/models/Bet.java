package com.example.backend.betthebracket.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bets")
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long gameId;
    private String betType;  // Example: "win", "loss", "spread"
    private double amount;
    private String odds;  // Example: "+200", "-150"
    private String status;  // Example: "pending", "won", "lost"
    private String openOrClosed; //

    private String teamPicked; // team the user picked to win. 
    private LocalDateTime timestamp;
    private boolean isOpen;  // NEW FIELD: True = Open, False = Closed
    private double potentialPay;
    private String sport;

    public Bet() {
        this.status = "pending";
        this.isOpen = true;  // Default: Open when created
    }

    public Bet(User user, Long gameId, String betType, double amount, String odds, String teamPicked, double potentialPay, String sport) {
        this.user = user;
        this.gameId = gameId;
        this.betType = betType;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.odds = odds;
        this.status = "pending";
        this.isOpen = true;  // Default: Open when created
        this.teamPicked = teamPicked;
        this.potentialPay = potentialPay;
        this.sport = sport;
        this.openOrClosed = "open";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public Long getGameId() { return gameId; }
    public String getBetType() { return betType; }
    public double getAmount() { return amount; }
    public String getOdds() { return odds; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getStatus() { return status; }
    public boolean isOpen() { return isOpen; }  // Getter for isOpen
    public String getTeamPicked() { return teamPicked; }
    public String getSport() { return sport; }
    public double getPotentialPay() { return potentialPay; }
    public String getOpenOrClosed() {return openOrClosed; }

    public void setUser(User user) { this.user = user; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    public void setBetType(String betType) { this.betType = betType; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setOdds(String odds) { this.odds = odds; }
    public void setStatus(String status) { this.status = status; }
    public void setOpen(boolean isOpen) { this.isOpen = isOpen; }  // Setter for isOpen
    public void setTeamPicked(String teamPicked) { this.teamPicked = teamPicked; }
    public void setSport(String sport) { this.sport = sport; }
    public void setPotentialPay(double potentialPay) { this.potentialPay = potentialPay; }
    public void setOpenOrClosed(String openOrClosed) { this.openOrClosed = openOrClosed; }
}