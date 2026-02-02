package com.example.backend.betthebracket.controllers;

import java.lang.StackWalker.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.betthebracket.controllers.UserController.BetReturnObject;
import com.example.backend.betthebracket.models.Bet;
import com.example.backend.betthebracket.models.CBBGame;
import com.example.backend.betthebracket.models.Game;
import com.example.backend.betthebracket.models.NBAGame;
import com.example.backend.betthebracket.models.User;
import com.example.backend.betthebracket.repository.CBBGameRepository;
import com.example.backend.betthebracket.repository.GameRepository;
import com.example.backend.betthebracket.repository.NBAGameRepository;
import com.example.backend.betthebracket.repository.UserRepository;
import com.example.backend.betthebracket.services.UpdateBetsService;

/**
 * Controller class that exposes functionality to the frontend. 
 * WIP - needs more methods for retrieving other info.
 */
@CrossOrigin(origins = "*") // allow requests from all origins for development, change to specific frontend url later
@RestController
@RequestMapping("/api/betthebracket/users")
public class UserController {
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final NBAGameRepository nbaGameRepository;
    private final UpdateBetsService updateBetsService;
    private final CBBGameRepository cbbGameRepository;
    
    public UserController(UserRepository userRepository, CBBGameRepository cbbGameRepository, GameRepository gameRepository, NBAGameRepository nbaGameRepository, UpdateBetsService updateBetsService) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.nbaGameRepository = nbaGameRepository;
        this.updateBetsService = updateBetsService;
        this.cbbGameRepository = cbbGameRepository;
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    /** 
     * End point for retrieving the users username and balance
     * @param Request as <'authToken', authToken>  
     * @return response 
     *      <username,  username> (String, String)
     *      <balance, balance> (String, Double)
     */ 
    @PostMapping("/getUsernameAndBalance")
    public ResponseEntity<?> getUser(@RequestBody Map<String, String> request) {
        String authToken = request.get("authToken");
        
        if (authToken == null || authToken.isBlank()) {
            return ResponseEntity.badRequest().body("invalid auth token");
        }

        Optional<User> userOptional = userRepository.findByAuthToken(authToken);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Error retrieving user. Auth token is valid, issue is elsewhere");
        }
        User user = userOptional.get();

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("balance", user.getBalance());

        return ResponseEntity.ok(response);
    }

    /**
     * End point for depositing to the users balance
     * @param depositRequest containing (authToken: "auth token", amount: "amount")
     * @return success or failure message, must request balance after this to update on frontend
     */
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, String> depositRequest) {
        String authToken = depositRequest.get("authToken");
        String amount = depositRequest.get("amount");
        Double depoAmount = Double.parseDouble(amount);

        if (authToken == null || authToken.isBlank()) { return ResponseEntity.badRequest().body("Invalid auth token!"); }
        Optional<User> userOpt = userRepository.findByAuthToken(authToken);
        if (userOpt.isEmpty()) { return ResponseEntity.badRequest().body("Can't find user!"); }

        User user = userOpt.get();

        user.setBalance(user.getBalance() + depoAmount);

        userRepository.save(user);

        return ResponseEntity.ok().body("Deposit successful!");
    }

    /**
     * Endpoint for withdrawing users funds
     * @param withdrawRequest containing (authToken: "auth token", amount: "amount")
     * @return success or failure message.
     */
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, String> withdrawRequest) {
        String authToken = withdrawRequest.get("authToken");
        String amount = withdrawRequest.get("amount");
        Double withdrawAmount = Double.parseDouble(amount);

        if (authToken == null || authToken.isBlank()) { return ResponseEntity.badRequest().body("Invalid auth token!"); }
        Optional<User> userOpt = userRepository.findByAuthToken(authToken);
        if (userOpt.isEmpty()) { return ResponseEntity.badRequest().body("Can't find user!"); }

        User user = userOpt.get();

        Double currentBalance = user.getBalance();

        if (currentBalance < withdrawAmount) { return ResponseEntity.badRequest().body("Users balance(" + currentBalance + ") for the withdrawal of amount (" + withdrawAmount + ")"); }

        user.setBalance(currentBalance - withdrawAmount);

        userRepository.save(user);

        return ResponseEntity.ok().body("Withdraw Successful!");
    }


    /**
     * Use for signup when creating a user.
     * Requires JSON format request with "username", "email", and "password"
     * @param user the object for the user being created on signup
     * @return response 200 ok if good, 400 if bad
     */
    @PostMapping
    public ResponseEntity<Map<String,String>> addUser(@RequestBody User user) {

        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("Error Message", "Username, Email, and Password are required.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("Error Message", "Email is already in use.");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("Error Message", "Username is already taken.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // password encryption using BCryptPasswordEncoder from the spring framework
        // reference: https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html

        String hashed = "password";
        user.setPassword(hashed);

        //TODO: remove later
        user.setBalance(1000.0);

        userRepository.save(user);
        Map<String, String> successResponse = new HashMap<String, String>();
        successResponse.put("Message", "User " + user.getUsername() + " added successfully");
        return ResponseEntity.ok(successResponse);
    }

    /**
     * Retrieve users bets using authentication token created on login
     * @param request
     * @return
     */
    @PostMapping("/getBets")
    public ResponseEntity<?> getUserBets(@RequestBody Map<String, String> request) {
        String authToken = request.get("authToken");
        if (authToken == null || authToken.isBlank()) {
            return ResponseEntity.badRequest().body("invalid auth token");
        }
        updateBetsService.settleNBABets();

        // use auth token to find the user in users db
        Optional<User> userOptional = userRepository.findByAuthToken(authToken);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Error retrieving user. Auth token is valid, issue is elsewhere");
        }

        User user = userOptional.get();
        
        // get list of bets users -> bets through mapping in User.java
        List<Bet> bets = user.getBets();

        // create empty list of Bet responses
        List<BetReturnObject> response = new ArrayList<>();

        for (Bet bet : bets) {
            switch(bet.getSport()) {
                case "NBA":
                    Optional<NBAGame> nbaGameOptional = nbaGameRepository.findById(bet.getGameId());
                    nbaGameOptional.ifPresent(game -> response.add(new BetReturnObject(bet, game)));
                    break;
                case "MARCHMADNESS":
                    Optional<Game> mmGameOptional = gameRepository.findById(bet.getGameId());
                    mmGameOptional.ifPresent(game -> response.add(new BetReturnObject(bet, game)));
                    break;
                case "CBB":
                    Optional<CBBGame> cbbGameOptional = cbbGameRepository.findById(bet.getGameId());
                    cbbGameOptional.ifPresent(game -> response.add(new BetReturnObject(bet, game)));
                case "default": 
                    continue;
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/getBetStats")
    public ResponseEntity<?> getBetStats(@RequestBody Map<String, String> request) {
        System.out.println("getBetStats HIT");
        String authToken = request.get("authToken");
        if (authToken == null || authToken.isBlank()) {
            return ResponseEntity.badRequest().body("invalid auth token");
        }
        Optional<User> userOpt = userRepository.findByAuthToken(authToken);
        if (userOpt.isEmpty()) { 
            return ResponseEntity.badRequest().body("Error retrieving user. Auth token is valid, issue is elsewhere");
        }

        User user = userOpt.get();

        Map<String, Object> response = new HashMap<>();

        response.put("totalWagered", user.getTotalWagered());
        response.put("totalProfit", user.getTotalProfit());
        response.put("totalSlotWagered", user.getTotalSlotWagered());
        response.put("totalSlotProfit", user.getTotalSlotProfit());
        response.put("totalSpins", user.getSlotSpins());

        return ResponseEntity.ok(response);

    }


    /**
     * Object for creating a custom response for each of the users bets
     * Combines the bet + game info using the gameId field from each bet. 
     */
    public static class BetReturnObject {
        private final Long betId;
        private final String betType;
        private final double amount;
        private final String odds;
        private final String status;
        private final boolean isOpen;
        private final LocalDateTime timestamp; // time bet was placed at
        private final String teamPicked; // the String name of the team selected to win 
        private final String openOrClosed;

        private final Long gameId;
        private final String homeTeam;
        private final String awayTeam;
        private final String date; // game date
        private final String time; // game time
        private final String winner; // winner of game
        private final String gameStatus; // "pending" or "finished" 
        private final double potentialPay;

        public BetReturnObject(Bet bet, Game game) {
            // bet stuff
            this.betId = bet.getId();
            this.betType = bet.getBetType();
            this.amount = bet.getAmount();
            this.odds = bet.getOdds();
            this.status = bet.getStatus();
            this.isOpen = bet.isOpen();
            this.timestamp = bet.getTimestamp();
            this.teamPicked = bet.getTeamPicked();
            this.potentialPay = bet.getPotentialPay();
            this.openOrClosed = bet.getOpenOrClosed();
            
            // game stuff
            this.gameId = game.getId();
            this.homeTeam = game.getHomeTeam();
            this.awayTeam = game.getAwayTeam();
            this.date = game.getDate();
            this.time = game.getTime();
            this.winner = game.getWinner();
            this.gameStatus = game.getStatus();

        }

        public BetReturnObject(Bet bet, NBAGame game) {
            this.betId = bet.getId();
            this.betType = bet.getBetType();
            this.amount = bet.getAmount();
            this.odds = bet.getOdds();
            this.status = bet.getStatus();
            this.isOpen = bet.isOpen();
            this.timestamp = bet.getTimestamp();
            this.teamPicked = bet.getTeamPicked();
            this.potentialPay = bet.getPotentialPay();
            this.openOrClosed = bet.getOpenOrClosed();

            this.gameId = game.getId();
            this.homeTeam = game.getHomeTeam();
            this.awayTeam = game.getAwayTeam();
            this.date = game.getDate();
            this.time = game.getTime();
            this.winner = game.getWinner();
            this.gameStatus = game.getStatus();
        }
        public BetReturnObject(Bet bet, CBBGame game) {
            this.betId = bet.getId();
            this.betType = bet.getBetType();
            this.amount = bet.getAmount();
            this.odds = bet.getOdds();
            this.status = bet.getStatus();
            this.isOpen = bet.isOpen();
            this.timestamp = bet.getTimestamp();
            this.teamPicked = bet.getTeamPicked();
            this.potentialPay = bet.getPotentialPay();
            this.openOrClosed = bet.getOpenOrClosed();
            this.date = "";
            this.gameId = game.getId();
            this.homeTeam = game.getHomeTeam();
            this.awayTeam = game.getAwayTeam();
            this.time = game.getStartTime().toString();
            this.winner = game.getWinner();
            this.gameStatus = game.getStatus();
        }
        //getters & setters
        public Long getBetId() { return betId; }
        public String getBetType() { 
            return betType; 
        }
        public double getAmount() { 
            return amount; 
        }
        public String getOdds() { 
            return odds; 
        }
        public String getStatus() { 
            return status; 
        }
        public boolean isOpen() { 
            return isOpen; 
        }
        public LocalDateTime getTimestamp() { 
            return timestamp; 
        }
        public String getTeamPicked() { 
            return teamPicked; 
        }

        public Long getGameId() { 
            return gameId; 
        }
        public String getHomeTeam() { 
            return homeTeam; 
        }
        public String getAwayTeam() { 
            return awayTeam; 
        }
        public String getDate() { 
            return date; 
        }
        public String getTime() { 
            return time; 
        }
        public String getWinner() { 
            return winner; 
        }
        public String getGameStatus() { 
            return gameStatus; 
        }
        public double getPotentialPay() {
            return potentialPay;
        }
        public String getOpenOrClosed() {
            return openOrClosed;
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}