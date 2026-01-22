package com.example.backend.betthebracket.services;

import java.util.ArrayList;
import java.util.List;

public class Betting {
    // List to store all available betting matchups
    private List<BettingPair> bettingPairs;

    public Betting() {
        this.bettingPairs = new ArrayList<>();
    }

    // Method to add a matchup with odds
    public void addMatchup(String homeTeam, double homeOdds, String awayTeam, double awayOdds, String bookmaker, String startTime) {
        BettingPair pair = new BettingPair(homeTeam, homeOdds, awayTeam, awayOdds, bookmaker, startTime);
        bettingPairs.add(pair);
    }

    // Display all available matchups
    public void displayMatchups() {
        if (bettingPairs.isEmpty()) {
            System.out.println("No matchups available.");
            return;
        }

        System.out.println("Available Bets:");
        for (int i = 0; i < bettingPairs.size(); i++) {
            BettingPair pair = bettingPairs.get(i);
            System.out.println((i + 1) + ". " + pair);
        }
    }

    // Place a bet and calculate potential winnings
    public void placeBet(int matchupIndex, String team, double amount) {
        if (matchupIndex < 1 || matchupIndex > bettingPairs.size()) {
            System.out.println("Invalid matchup selection.");
            return;
        }

        BettingPair pair = bettingPairs.get(matchupIndex - 1);
        double odds = pair.getOddsForTeam(team);

        if (odds == -1) {
            System.out.println("Invalid team selection.");
            return;
        }

        double potentialPayout = amount * odds;
        double profit = potentialPayout - amount;

        System.out.println("You placed a bet on " + team + " with $" + amount);
        System.out.println("Potential Payout: $" + String.format("%.2f", potentialPayout) + " (Profit: $" + String.format("%.2f", profit) + ")");
    }

    // Inner class to store each betting matchup
    private static class BettingPair {
        private String homeTeam;
        private double homeOdds;
        private String awayTeam;
        private double awayOdds;
        private String bookmaker;
        private String startTime;

        public BettingPair(String homeTeam, double homeOdds, String awayTeam, double awayOdds, String bookmaker, String startTime) {
            this.homeTeam = homeTeam;
            this.homeOdds = homeOdds;
            this.awayTeam = awayTeam;
            this.awayOdds = awayOdds;
            this.bookmaker = bookmaker;
            this.startTime = startTime;
        }

        // Get odds for the selected team
        public double getOddsForTeam(String team) {
            if (team.equalsIgnoreCase(homeTeam)) {
                return homeOdds;
            } else if (team.equalsIgnoreCase(awayTeam)) {
                return awayOdds;
            }
            return -1; // Invalid team
        }

        @Override
        public String toString() {
            return homeTeam + " (" + homeOdds + ") vs " + awayTeam + " (" + awayOdds + ") | Bookmaker: " + bookmaker + " | Start Time: " + startTime;
        }
    }
}
