package com.example.backend.betthebracket.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.betthebracket.models.User;
import com.example.backend.betthebracket.repository.UserRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/betthebracket/slot/")
public class SlotController {

    private final UserRepository userRepository;

    @Autowired
    public SlotController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    String[] symbols = {"A", "J", "Q", "K", "GK"};
    private static final int[][] PAYLINES = {
        {0,0,0,0,0}, //top row
        {1,1,1,1,1}, // 2nd row
        {2,2,2,2,2}, // 3rd row
        {3,3,3,3,3}, // 4th row
        {0,1,0,1,0}, // zig zags
        {1,0,1,0,1},
        {1,2,1,2,1},
        {2,1,2,1,2},
        {2,3,2,3,2},
        {3,2,3,2,3},
        {0,1,2,1,0}, // big V shape
        {1,2,3,2,1},
        {2,1,0,1,2},
        {3,2,1,2,3},
        {0,1,1,1,0}, // shallow v shape
        {1,2,2,2,1},
        {2,3,3,3,2},
        {3,2,2,2,3},
        {2,1,1,1,2},
        {1,0,0,0,1}
    };
    Map<String, double[]> payTable = Map.of(
        "J", new double[]{0,0,.1,.5,2},
        "Q", new double[]{0,0,.2,.7,3},
        "K", new double[]{0,0,.3,.9,5},
        "A", new double[]{0,0,.5,1.5,10},
        "GK", new double[]{0,0,1,3,5}
    );
    double[] finalWeights = {0.28854274, 0.34470051, 0.16417508, 0.1295579, 0.07302378};

    
    @PostMapping("/spin")
    public SpinResponse spinSlot(@RequestBody Map<String, String> request) {
        String authToken = request.get("authToken");
        System.out.println(authToken);
        Optional<User> userOpt = userRepository.findByAuthToken(authToken.trim());
        if (userOpt.isEmpty()) { throw new Error("User not found"); }
        User user = userOpt.get();

        
        Double wager = Double.parseDouble(request.get("wager"));
        if (user.getBalance() - wager < 0.0) { throw new Error("User balance too low"); }
        
        
        
        List<List<String>> reels = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            reels.add(generateReel(200));
        }

        double payout = processSpin(reels, wager);

        double net = payout - wager;

        double userBal = user.getBalance();
        user.addSlotSpin(wager, payout);
        double newUserBal = userBal + net;
        user.setBalance(newUserBal);
        userRepository.save(user);
        SpinResponse response = new SpinResponse(wager, payout, reels, newUserBal);
        return response;
    }


    public List<String> generateReel(int size) {
        List<String> reel = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            double r = ThreadLocalRandom.current().nextDouble();
            double cumulative = 0.0;
            for (int j = 0; j < symbols.length; j++) {
                cumulative += finalWeights[j];
                if (r < cumulative) {
                    reel.add(symbols[j]);
                    break;
                }

            }
        }
        return reel;
    } 
    //**
    /* Generate 5x4 reels and then run a modified DFS to find paylines 
    /* 
    */
    public double processSpin(List<List<String>> reels, double wager) {

        
        // create grid with symbols.
        String[][] grid = new String[5][4];

        for (int col = 0; col < 5; col++) {
            List<String> reel = reels.get(col);
            int size = reel.size();
            for (int row = 0; row < 4; row++) {
                grid[col][row] = reel.get(size - 4 + row);
            }
        }

        // print for debugging
        System.out.println("GRID (col x row):");
        for (int row = 0; row < 4; row++) {
            for (int col = 0; col < 5; col++) {
                System.out.print(grid[col][row] + "\t");
            }
            System.out.println();
        }



        List<List<String>> allLines = new ArrayList<>();
        checkPayLines(grid, allLines);

        double payout = calculatePayout(allLines, wager);


        System.out.println("\nTotal lines: " + allLines.size());

        int count = 1;
        for (List<String> line : allLines) {
            System.out.println(count++ + ": " + line);
        }
        return payout;
    }

    /**
     * Iterate over each payline, and check whether there is a symbol path 
     * @param grid
     * @param allLines add paths to alllines if matching symbols and length of 3+
     */
    public void checkPayLines(String[][] grid, List<List<String>> allLines) {
        for (int[] payline : PAYLINES) {
            String baseSymbol = null;

            List<String> matched = new ArrayList<>();

            for (int col = 0; col < 5; col++) {
                String symbol = grid[col][payline[col]];
                if (baseSymbol == null) { 
                    baseSymbol = symbol;
                    
                 }
                
                if (symbol.equals(baseSymbol)) {
                    matched.add(symbol);

                }
                else { break; }
            }
            if (!matched.isEmpty() && matched.size() >= 3) {
                allLines.add(matched);
            }
        }
    }

    public double calculatePayout(List<List<String>> allLines, double wager) {
        double payout = 0.0;
        for (List<String> line : allLines) {
            int matchedLength = line.size();
            String symbol = line.get(0);

            double[] linePays = payTable.get(symbol);

            if (linePays != null) {
                payout += wager * linePays[matchedLength - 1];
            }
        }
        return payout;
    }

    /**
     * Perform modified DFS 
     * ____________REMOVED___________________
     * @param col current column, starts with 0
     * @param row current row
     * @param path current path we are exploring
     * @param allLines a list of all lines found
     * @param grid 5x4 grid 
     */
    void dfs(int col, int row, List<String> path, List<List<String>> allLines, String[][] grid) {
        path.add(grid[col][row]); // add current node to path.

        if (col == 4) {
            allLines.add(new ArrayList<>(path));
        }
        else {
            int[] r = new int[]{-1, 0, 1};
            for (int i : r) {
                int nextRow = i + row;
                if (nextRow >= 0 && nextRow < 4) {
                    dfs(col + 1, nextRow, path, allLines, grid);

                }
            }
            
        }
        path.remove(path.size() - 1); 

    }

    /* 
    public static void main(String[] args) {
        SlotController slot = new SlotController(null);

        List<List<String>> reels = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            reels.add(slot.generateReel(200));
        }

        double payout = slot.processSpin(reels, 1.0);
        System.out.println("Payout: " + payout);
    }*/
}



class SpinResponse {
    Double wager;
    Double payout;
    Double userBalance;

    List<List<String>> reels;

    public SpinResponse(Double wager, Double payout, List<List<String>> reels, Double userBalance) {
        this.wager = wager;
        this.payout = payout;
        this.reels = reels;
        this.userBalance = userBalance;
    }

    public Double getWager() { return wager; }
    public Double getPayout() { return payout; }
    public List<List<String>> getReels() { return reels; }
    public Double getUserBalance() { return userBalance; }

    public void setWager(Double wager) { this.wager = wager; }
    public void setPayout(Double payout) { this.payout = payout; }
    public void setReels(List<List<String>> reels) { this.reels = reels; }
    public void setUserBalance(Double userBalance) {this.userBalance = userBalance; }

}
