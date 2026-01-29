package com.example.backend.betthebracket.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.betthebracket.models.Bet;
import com.example.backend.betthebracket.models.BetRequest;
import com.example.backend.betthebracket.models.User;
import com.example.backend.betthebracket.repository.BetRepository;
import com.example.backend.betthebracket.repository.GameRepository;
import com.example.backend.betthebracket.repository.UserRepository;

/**
 * Controller to handle betting-related operations.
 * Provides endpoints for placing bets, retrieving bet history, closing bets, and filtering open/closed bets.
 */
@CrossOrigin(origins = "*")  // Allow requests from any origin (useful for frontend integration)
@RestController
@RequestMapping("/api/betthebracket/bets")  // Base endpoint for all bet-related operations
public class BetController {

    private final BetRepository betRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    /**
     * Constructor for dependency injection of repositories.
     * @param betRepository - Repository for managing bets.
     * @param userRepository - Repository for managing users.
     */
    public BetController(BetRepository betRepository, UserRepository userRepository, GameRepository gameRepository) {
        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    /**
     * Endpoint to place a new bet.
     * @param betRequest - JSON request containing user ID, game ID, bet type, amount, and odds.
     * @return ResponseEntity indicating success or failure.
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeBet(@RequestBody BetRequest betRequest) {
        String authToken = betRequest.getAuthToken();
        Optional<User> user = userRepository.findByAuthToken(authToken);

        if (user.isPresent()) {
            User currentUser = user.get();

            // Create bet object with all required fields including teamPicked
            Bet newBet = new Bet(
                currentUser,
                betRequest.getGameId(),
                betRequest.getBetType(),
                betRequest.getAmount(),
                betRequest.getOdds(),
                betRequest.getTeamPicked(),
                betRequest.getPotentialPay(),
                betRequest.getSport()
            );

            try {
                currentUser.placeBet(newBet);  // Handles balance validation + deduction
                userRepository.save(currentUser); // Save updated user
                //betRepository.save(newBet);       // Save the bet itself potentially causes duplicate bets being placed.
                return ResponseEntity.ok(newBet);
            } catch (IllegalArgumentException | IllegalStateException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else {
            return ResponseEntity.badRequest().body("User not found.");
        }
    }

    /**
     * Endpoint to retrieve a user's full betting history.
     * @param userId - The ID of the user whose bets are being retrieved.
     * @return A list of all bets placed by the user.
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Bet>> getUserBetHistory(@PathVariable Long userId) {
        List<Bet> bets = betRepository.findByUserId(userId);
        return ResponseEntity.ok(bets);
    }

    /**
     * Endpoint to close a bet (mark it as settled).
     * @param betId - The ID of the bet to be closed.
     * @return ResponseEntity indicating success or failure.
     */
    @PatchMapping("/close/{betId}")
    public ResponseEntity<?> closeBet(@PathVariable Long betId) {
        Optional<Bet> bet = betRepository.findById(betId);
        
        if (bet.isPresent()) {
            Bet existingBet = bet.get();
            existingBet.setOpen(false);  // Mark bet as closed
            betRepository.save(existingBet);
            return ResponseEntity.ok("Bet closed successfully!");
        } else {
            return ResponseEntity.badRequest().body("Bet not found.");
        }
    }

    /**
     * Endpoint to retrieve all open (active) bets.
     * @return A list of bets where isOpen = true.
     */
    @GetMapping("/open")
    public ResponseEntity<List<Bet>> getOpenBets() {
        return ResponseEntity.ok(betRepository.findByIsOpenTrue());
    }

    /**
     * Endpoint to retrieve all closed (settled) bets.
     * @return A list of bets where isOpen = false.
     */
    @GetMapping("/closed")
    public ResponseEntity<List<Bet>> getClosedBets() {
        return ResponseEntity.ok(betRepository.findByIsOpenFalse());
    }
}