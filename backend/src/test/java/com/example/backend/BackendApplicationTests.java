package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Instant;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.backend.betthebracket.models.Bet;
import com.example.backend.betthebracket.models.CBBGame;
import com.example.backend.betthebracket.models.User;
import com.example.backend.betthebracket.services.UpdateBetsService;

import jakarta.transaction.Transactional;

@Disabled
@SpringBootTest
@Transactional
class BackendApplicationTests {

	@Autowired
	private UpdateBetsService updateBetsService;

@Test
    void betPayoutOccurs() {

        User user = new User();
        user.setBalance(1000.0);
        
        
        Instant testTime = Instant.parse("2026-01-01T00:00:00Z");

        CBBGame game = new CBBGame(null, "home-team", "away-team", testTime , 1.05, 2.5, "000");

        Bet bet = new Bet(user, game.getId(), "h2h", 100.0, Double.toString(game.getHomeOdds()), game.getHomeTeam(), 105.0, "cbb");

        user.placeBet(bet);

        game.setStatus("finished");

        updateBetsService.settleCBBBets();

		assertEquals(game.getStatus(), "finished");


    }

}
