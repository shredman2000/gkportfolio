package com.example.backend.betthebracket.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * User class for testing, replace with Dylans user class.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private Double balance;

    @Column(nullable = true, unique = true)
    @JsonIgnore
    private String authToken;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Bet> bets;

    private Double totalWagered;
    private Double totalProfit;
    private Integer slotSpins;
    private Double totalSlotWagered;
    private Double totalSlotProfit;

    // Default constructor required by JPA
    public User() {
        this.balance = 0.0;
        this.bets = new ArrayList<>();
    }

    // Constructor with custom balance (for signup or admin creation)
    public User(String username, String password, String email, Double balance) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.balance = balance;
        this.bets = new ArrayList<>();
        this.totalWagered = 0.0;
        this.totalProfit = 0.0;
        this.slotSpins = 0;
        this.totalSlotWagered = 0.0;
        this.totalSlotProfit = 0.0;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public List<Bet> getBets() {
        return bets;
    }

    public void setBets(List<Bet> bets) {
        this.bets = bets;
    }

    public String printUserAndPassword() {
        return "Username: " + username + " Password: " + password;
    }

    public void deposit(Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero.");
        }
        this.balance += amount;
    }

    public void placeBet(Bet bet) {
        Double amount = bet.getAmount();
        if (amount <= 0) {
            throw new IllegalArgumentException("Bet amount must be greater than zero.");
        }
        if (this.balance < amount) {
            throw new IllegalStateException("Insufficient balance to place this bet.");
        }
        this.balance -= amount;
        bet.setUser(this);
        this.bets.add(bet);
        this.totalWagered += amount;
    }

    public void addBet(Bet bet) {
        bet.setUser(this);
        this.bets.add(bet);
    }

    public void addSlotSpin(Double wager, Double profit) {
        this.totalWagered += wager;
        this.totalSlotWagered += wager;
        this.totalProfit += profit;
        this.totalSlotProfit += profit;
        this.slotSpins++;
    }
    public void setTotalProfit(Double profit) {
        this.totalProfit += profit;
    }
    public Double getTotalProfit() {
        return totalProfit;
    }
    public Double getTotalSlotProfit() {
        return totalSlotProfit;
    }
    public Double getTotalWagered() {
        return totalWagered;
    }
    public Double getTotalSlotWagered() {
        return totalSlotWagered;
    }
    public int getSlotSpins() {
        return slotSpins;
    }
}