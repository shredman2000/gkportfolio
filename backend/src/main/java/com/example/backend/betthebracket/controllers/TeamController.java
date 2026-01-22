package com.example.backend.betthebracket.controllers;

import com.example.backend.betthebracket.models.Team;
import com.example.backend.betthebracket.repository.TeamRepository;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;


/**
 * Controller class that exposes functionality to the frontend. 
 * WIP - needs more methods for retrieving other info.
 */
@RestController 
@RequestMapping("/api/teams")
public class TeamController {
    private final TeamRepository teamRepository;
    
    public TeamController(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @GetMapping
    public List<Team> getTeams() {
        return teamRepository.findAll();
    }


    @PostMapping
    public String addTeam(@RequestBody Team team) {
        if (team.getTeamName() == null || team.getSeed() == 0) {
            return "Error: Team name and seed required";
        }
        teamRepository.save(team);
        return "Team: " + team.getTeamName() + " added successfully";
    }
}