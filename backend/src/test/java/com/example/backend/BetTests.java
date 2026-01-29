package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.example.backend.betthebracket.models.Bet;
import com.example.backend.betthebracket.models.CBBGame;
import com.example.backend.betthebracket.models.User;

public class BetTests {
    
    @Test
    void placingBetWorks() {
        User user = new User();
        user.setBalance(1000.0);

        Bet bet = new Bet();
        bet.setAmount(100.0);

        user.placeBet(bet);

        assertEquals(900.0, user.getBalance());

    }

    @Test
    void placingBetTooLargeThrowsError() {
        User user = new User();
        user.setBalance(100.0);

        Bet bet = new Bet();
        bet.setAmount(1000.0);

        assertThrows(IllegalStateException.class, () -> {
            user.placeBet(bet);
        });

    }

    @Test
    void betPayoutOccurs() {
        User user = new User();
        user.setBalance(1000.0);
        
        
        Instant testTime = Instant.parse("2026-01-01T00:00:00Z");

        CBBGame game = new CBBGame(null, "home-team", "away-team", testTime , 1.05, 2.5, "000");

        Bet bet = new Bet(user, game.getId(), "h2h", 100.0, Double.toString(game.getHomeOdds()), game.getHomeTeam(), 105.0, "cbb");

        user.placeBet(bet);

        

    }
}
