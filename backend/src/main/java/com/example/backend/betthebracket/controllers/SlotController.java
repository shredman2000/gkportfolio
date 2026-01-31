package com.example.backend.betthebracket.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.betthebracket.repository.UserRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/betthebracket/slot/")
public class SlotController {
    private final UserRepository userRepository;

    public SlotController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    String[] symbols = {"A", "J", "Q", "K", "GK"};

    @PostMapping("/spin")
    public SpinResponse spinSlot(@RequestBody Map<String, String> request) {
        Double wager = Double.parseDouble(request.get("wager"));

        List<List<String>> reels = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            reels.add(generateReel(200));
        }

        

        SpinResponse response = new SpinResponse(wager, 0.0, reels);
        return response;
    }


    public List<String> generateReel(int size) {
        List<String> reel = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            reel.add(symbols[ThreadLocalRandom.current().nextInt(symbols.length)]);
        }
        return reel;
    } 


}



class SpinResponse {
    Double wager;
    Double payout;

    List<List<String>> reels;

    public SpinResponse(Double wager, Double payout, List<List<String>> reels) {
        this.wager = wager;
        this.payout = payout;
        this.reels = reels;
    }

    public Double getWager() { return wager; }
    public Double getPayout() { return payout; }
    public List<List<String>> getReels() { return reels; }

    public void setWager(Double wager) { this.wager = wager; }
    public void setPayout(Double payout) { this.payout = payout; }
    public void setReels(List<List<String>> reels) { this.reels = reels; }


}
