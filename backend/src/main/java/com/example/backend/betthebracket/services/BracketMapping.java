package com.example.backend.betthebracket.services;

public class BracketMapping {
    private String bracketTag;
    private int bracketNum;

    public BracketMapping(String bracketTag, int bracketNum) {
        this.bracketTag = bracketTag;
        this.bracketNum = bracketNum;
    }

    public String getBracketTag() {
        return bracketTag;
    }

    public int getBracketNum() {
        return bracketNum;
    }
}