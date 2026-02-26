package com.example.backend.movieconnections.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class GameMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String title;

    @ManyToOne
    @JoinColumn(name = "game_id")
    @JsonIgnore
    private MovieGame game;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Clue> clues = new ArrayList<>();
    

    public GameMovie() {}

    public GameMovie(String title) {
        this.title = title;
    }

    public void setGame(MovieGame game) {
        this.game = game;
    }
    public String getTitle() {
        return this.title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void addClue(Clue clue) {
        clues.add(clue);
        clue.setMovie(this);
    }
    public List<Clue> getClues() {
        return this.clues;
    }

    public MovieGame getGame() {
        return this.game;
    }
}
