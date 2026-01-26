package com.example.backend.betthebracket.services;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.betthebracket.models.CBBGame;
import com.example.backend.betthebracket.models.Game;
import com.example.backend.betthebracket.repository.CBBGameRepository;
import com.example.backend.betthebracket.repository.GameRepository;
import com.example.backend.betthebracket.services.finishedGames.FinishedGameResult;
import com.example.backend.betthebracket.services.finishedGames.FinishedGameResult.TournamentRound;
import com.example.backend.betthebracket.services.OddsAPIParser.ParsedGameOdds;

@Service
public class GameService {
    private final OddsFetcher oddsFetcher;
    private final OddsAPIParser oddsAPIParser;
    private final GameRepository gameRepository;
    private final FinishedGameResult finishedGameResult;
    private final CBBGameRepository cbbGameRepository;
    private final ScoreFetcher scoreFetcher;

    public GameService(OddsFetcher oddsFetcher, ScoreFetcher scoreFetcher, OddsAPIParser oddsAPIParser, GameRepository gameRepository, FinishedGameResult finishedGameResult, CBBGameRepository cbbGameRepository) {
        this.oddsFetcher = oddsFetcher;
        this.oddsAPIParser = oddsAPIParser;
        this.gameRepository = gameRepository;
        this.finishedGameResult = finishedGameResult;
        this.cbbGameRepository = cbbGameRepository;
        this.scoreFetcher = scoreFetcher;
    }

    /**
     * Retrieve games from api using oddsFetcher, 
     * and then parse them into game objects using oddsAPIParser,
     * then save all to the Games database.
     */
    @Transactional
    public List<Game> getGames() {
        if (gameRepository.count() == 0) {
            populateBracket();
        }

        boolean advanced = true;

        while (advanced) {
            updateWinners();
            int before = (int) gameRepository.count();

            advanceTeams();
            int after = (int) gameRepository.count();

            advanced = after > before;
        }

        //updateGamesFromApi();

        return gameRepository.findAll();
    }

    @Transactional
    public List<CBBGame> getCBBGames() {
        updateScoresFromApi("cbb");
        updateGamesFromApi("cbb");
        
        List<CBBGame> cbbGames = cbbGameRepository.findAll();
        return cbbGames;
    }
    
    /**
     * Initially creates all the matchups for the round of 64 with odds for games
     * 
    */
    @Transactional
    public void populateBracket() {
        if (gameRepository.count() > 0 ) { return; } 
        //debugging
        List<Game> matchups = List.of(
            // East
            new Game(TournamentRound.ROUND_OF_64, "East", 1, "Duke Blue Devils", 16, "Norfolk State Spartans", "TBD", "TBD", -10000.0, 3000.0, "Duke Blue Devils", "roundOf64_E1", 1),
            new Game(TournamentRound.ROUND_OF_64, "East", 8, "Mississippi State Bulldogs", 9, "Baylor Bears", "TBD", "TBD", -120.0, 100.0, "Baylor Bears", "roundOf64_E2", 2),
            new Game(TournamentRound.ROUND_OF_64, "East", 5, "Oregon Ducks", 12, "Liberty Flames", "TBD", "TBD", -278.0, 225.0, "Oregon Ducks", "roundOf64_E3", 3),
            new Game(TournamentRound.ROUND_OF_64, "East", 4, "Arizona Wildcats", 13, "Akron Zips", "TBD", "TBD", -450.0, 350.0, "Arizona Wildcats", "roundOf64_E4", 4),
            new Game(TournamentRound.ROUND_OF_64, "East", 6, "BYU Cougars", 11, "VCU Rams", "TBD", "TBD", -180.0, 150.0, "BYU Cougars", "roundOf64_E5", 5),
            new Game(TournamentRound.ROUND_OF_64, "East", 3, "Wisconsin Badgers", 14, "Montana Grizzlies", "TBD", "TBD", -650.0, 475.0, "Wisconsin Badgers", "roundOf64_E6", 6),
            new Game(TournamentRound.ROUND_OF_64, "East", 7, "Saint Mary's Gaels", 10, "Vanderbilt Commodores", "TBD", "TBD", -135.0, 115.0, "Saint Mary's Gaels", "roundOf64_E7", 7),
            new Game(TournamentRound.ROUND_OF_64, "East", 2, "Alabama Crimson Tide", 15, "Robert Morris Colonials", "TBD", "TBD", -5000.0, 1800.0, "Alabama Crimson Tide", "roundOf64_E8", 8),

            // Midwest
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 1, "Houston Cougars", 16, "SIU Edwardsville Cougars", "TBD", "TBD", -10000.0, 3000.0, "Houston Cougars", "roundOf64_M1", 1),
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 8, "Gonzaga Bulldogs", 9, "Georgia Bulldogs", "TBD", "TBD", -110.0, -110.0, "Gonzaga Bulldogs", "roundOf64_M2", 2),
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 5, "Clemson Tigers", 12, "McNeese Cowboys", "TBD", "TBD", -250.0, 200.0, "McNeese Cowboys", "roundOf64_M3", 3),
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 4, "Purdue Boilermakers", 13, "High Point Panthers", "TBD", "TBD", -500.0, 375.0, "Purdue Boilermakers", "roundOf64_M4", 4),
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 6, "Illinois Fighting Illini", 11, "Texas Longhorns", "TBD", "TBD", -140.0, 120.0, "Illinois Fighting Illini", "roundOf64_M5", 5),
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 3, "Kentucky Wildcats", 14, "Troy Trojans", "TBD", "TBD", -700.0, 500.0, "Kentucky Wildcats", "roundOf64_M6", 6),
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 7, "UCLA Bruins", 10, "Utah State Aggies", "TBD", "TBD", -150.0, 130.0, "UCLA Bruins", "roundOf64_M7", 7),
            new Game(TournamentRound.ROUND_OF_64, "Midwest", 2, "Tennessee Volunteers", 15, "Wofford Terriers", "TBD", "TBD", -3500.0, 1200.0, "Tennessee Volunteers", "roundOf64_M8", 8),

            // South
            new Game(TournamentRound.ROUND_OF_64, "South", 1, "Auburn Tigers", 16, "American Eagles", "TBD", "TBD", -10000.0, 3000.0, "Auburn Tigers", "roundOf64_S1", 1),
            new Game(TournamentRound.ROUND_OF_64, "South", 8, "Louisville Cardinals", 9, "Creighton Bluejays", "TBD", "TBD", -140.0, 120.0, "Creighton Bluejays", "roundOf64_S2", 2),
            new Game(TournamentRound.ROUND_OF_64, "South", 5, "Michigan Wolverines", 12, "UC San Diego Tritons", "TBD", "TBD", -150.0, 125.0, "Michigan Wolverines", "roundOf64_S3", 3),
            new Game(TournamentRound.ROUND_OF_64, "South", 4, "Texas A&M Aggies", 13, "Yale Bulldogs", "TBD", "TBD", -300.0, 250.0, "Texas A&M Aggies", "roundOf64_S4", 4),
            new Game(TournamentRound.ROUND_OF_64, "South", 6, "Ole Miss Rebels", 11, "North Carolina Tar Heels", "TBD", "TBD", -180.0, 150.0, "Ole Miss Rebels", "roundOf64_S5", 5),
            new Game(TournamentRound.ROUND_OF_64, "South", 3, "Iowa State Cyclones", 14, "Montana Grizzlies", "TBD", "TBD", -2000.0, 950.0, "Iowa State Cyclones", "roundOf64_S6", 6),
            new Game(TournamentRound.ROUND_OF_64, "South", 7, "Marquette Golden Eagles", 10, "New Mexico Lobos", "TBD", "TBD", -170.0, 145.0, "New Mexico Lobos", "roundOf64_S7", 7),
            new Game(TournamentRound.ROUND_OF_64, "South", 2, "Michigan State Spartans", 15, "Bryant Bulldogs", "TBD", "TBD", -3500.0, 1200.0, "Michigan State Spartans", "roundOf64_S8", 8),

            // West
            new Game(TournamentRound.ROUND_OF_64, "West", 1, "Florida Gators", 16, "Norfolk State Spartans", "TBD", "TBD", -10000.0, 3000.0, "Florida Gators", "roundOf64_W1", 1),
            new Game(TournamentRound.ROUND_OF_64, "West", 8, "UConn Huskies", 9, "Oklahoma Sooners", "TBD", "TBD", -160.0, 135.0, "UConn Huskies", "roundOf64_W2", 2),
            new Game(TournamentRound.ROUND_OF_64, "West", 5, "Memphis Tigers", 12, "Colorado State Rams", "TBD", "TBD", -140.0, 120.0, "Colorado State Rams", "roundOf64_W3", 3),
            new Game(TournamentRound.ROUND_OF_64, "West", 4, "Maryland Terrapins", 13, "Grand Canyon Antelopes", "TBD", "TBD", -600.0, 450.0, "Maryland Terrapins", "roundOf64_W4", 4),
            new Game(TournamentRound.ROUND_OF_64, "West", 6, "Missouri Tigers", 11, "Drake Bulldogs", "TBD", "TBD", -275.0, 220.0, "Drake Bulldogs", "roundOf64_W5", 5),
            new Game(TournamentRound.ROUND_OF_64, "West", 3, "Texas Tech Red Raiders", 14, "UNC Wilmington Seahawks", "TBD", "TBD", -2000.0, 950.0, "Texas Tech Red Raiders", "roundOf64_W6", 6),
            new Game(TournamentRound.ROUND_OF_64, "West", 7, "Kansas Jayhawks", 10, "Arkansas Razorbacks", "TBD", "TBD", -200.0, 170.0, "Arkansas Razorbacks", "roundOf64_W7", 7),
            new Game(TournamentRound.ROUND_OF_64, "West", 2, "St. John's Red Storm", 15, "Omaha Mavericks", "TBD", "TBD", -3000.0, 1250.0, "St. John's Red Storm", "roundOf64_W8", 8)
        );
        System.out.println("Populating bracket, matchups count = " + matchups.size());
        gameRepository.saveAll(matchups);
        System.out.println("Saved. DB count = " + gameRepository.count());
    }



    /**
     * 
     */
    @Transactional
    public void updateGamesFromApi(String gameType) {
        if (gameType == null) { return; }
        if ("cbb".equals(gameType)) {
            List<CBBGame> cbbGames = cbbGameRepository.findAll();
            String JSON = oddsFetcher.fetchOddsData("cbb");
            List<ParsedGameOdds> apiGames = oddsAPIParser.parseGames(JSON);
            
            System.out.println("IN UPDATEGAMESFROMAPI________________________________");
        
            //List<Game> games = gameRepository.findAll();

            /**
             * Iterate through the games retrieved from the api, and check whether they exist in the database already
             * we only want to update games in the database
             */
            for (ParsedGameOdds apiGame : apiGames) {
                CBBGame game = cbbGames.stream()
                    .filter(g -> (g.getHomeTeam().equals(apiGame.getHomeTeam()) && g.getAwayTeam().equals(apiGame.getAwayTeam())) ||
                                (g.getHomeTeam().equals(apiGame.getAwayTeam()) && g.getAwayTeam().equals(apiGame.getHomeTeam())))
                    .findFirst()
                    .orElse(null);
            
                if (game == null) {
                    game = new CBBGame(
                        null,
                        apiGame.getHomeTeam(),
                        apiGame.getAwayTeam(),
                        apiGame.getStartTime(),
                        apiGame.getHomeOdds(),
                        apiGame.getAwayOdds(),
                        apiGame.getExternalId()
                    );
                } else {
                    boolean matchesNormal = game.getHomeTeam().equals(apiGame.getHomeTeam()) && game.getAwayTeam().equals(apiGame.getAwayTeam());
                    if (matchesNormal) {
                        game.setHomeOdds(apiGame.getHomeOdds());
                        game.setAwayOdds(apiGame.getAwayOdds());
                    } else {
                        // If the teams are flipped in the API, flip the odds too
                        game.setHomeOdds(apiGame.getAwayOdds());
                        game.setAwayOdds(apiGame.getHomeOdds());
                        
                    }
                    game.setExternalId(apiGame.getExternalId());
                    game.setStartTime(apiGame.getStartTime());
                }

    
                game.setStartTime(apiGame.getStartTime());
                cbbGameRepository.save(game);
            } 
        }
            
    }

    @Transactional
    public void updateScoresFromApi(String gameType) {
        if (gameType == null) { return; }
        if ("cbb".equals(gameType)){
            List<CBBGame> cbbGames = cbbGameRepository.findAll();
            scoreFetcher.fetchScores("cbb");


        }
    }

    /*
     * C
     */
    @Transactional
    public void updateWinners() {
        System.out.println("Advance to next round reached"); //debug stuff
        // see finished game result and ScoresParser
       


        List<Game> allGames = gameRepository.findAll();
        TournamentRound currentRound = determineCurrentRound(allGames);
        if (currentRound == null) {
            System.out.println("Tournament complete");
            return;
        }
        List<GameResult> results = finishedGameResult.fetchScoresAndDetermineWinners(true, currentRound); 
        for (GameResult r : results) {
            System.out.println(r.getHomeTeam() + " vs " + r.getAwayTeam() + " -> " + r.getWinner());
        }
        for (Game game : allGames) {

            
            String home = game.getHomeTeam();
            String away = game.getAwayTeam();

            String key1 = home + " vs " + away;
            String key2 = away + " vs " + home;

            for (GameResult result : results) {
                if ((result.getHomeTeam().equals(home) && result.getAwayTeam().equals(away)) ||
                    (result.getHomeTeam().equals(away) && result.getAwayTeam().equals(home))) {

                    // Determine which score belongs to the home team
                    if (result.getHomeTeam().equals(home)) {
                        game.setHomeScore(result.getHomeScore());
                        game.setAwayScore(result.getAwayScore());
                    } else {
                        game.setHomeScore(result.getAwayScore());
                        game.setAwayScore(result.getHomeScore());
                    }

                    game.setWinner(result.getWinner());
                    game.setStatus("finished");
                    break;
                }
            }
        }
        
        gameRepository.saveAll(allGames);
        gameRepository.flush();
    }

    private TournamentRound determineCurrentRound(List<Game> games) {
        return games.stream()
            .filter(g -> !"finished".equals(g.getStatus()))
            .map(Game::getRound)
            .findFirst()
            .orElse(null);
    }
    @Transactional
    public void advanceTeams() {
        List<Game> allGames = gameRepository.findAll();

        // for duplicate checking. local only
        Set<String> createdGameKeys = new HashSet<>();

        for (Game game : allGames) {
            if (game.getWinner() != null) {
                //String homeTeam = game.getHomeTeam();
                //String awayTeam = game.getAwayTeam();

                int homeSeed = game.getSeed1();
                int awaySeed = game.getSeed2();
                String region = game.getRegion();

                //////////////////////// ROUND OF 64 ->>> 32
                if (game.getRound().equals(TournamentRound.ROUND_OF_64)) {

                    if (homeSeed == 1 || homeSeed == 16) { // would play 8 or 9 next
                        // check corresponding next matchup winner, is it set?
                        for (Game otherGame : allGames) {
                            if (otherGame.getRegion().equals(region) && otherGame.getRound().equals(TournamentRound.ROUND_OF_64)) {
                                if (otherGame.getSeed1() == 8 || otherGame.getSeed2() == 9) {

                                        createNewGame(TournamentRound.ROUND_OF_32, region, game, otherGame, allGames, createdGameKeys);
                                }
                            }
                        }

                    }
            
                    if (homeSeed == 5 || homeSeed == 12) { // would play 4 or 13 next
                        for (Game otherGame : allGames) {
                            if (otherGame.getRegion().equals(region) && otherGame.getRound().equals(TournamentRound.ROUND_OF_64)) {
                                if (otherGame.getSeed1() == 4 || otherGame.getSeed2() == 13) {

                                        createNewGame(TournamentRound.ROUND_OF_32, region, game, otherGame, allGames, createdGameKeys);
                                    
                                }
                            }
                        }
                    }
                    
                    if (homeSeed == 6 || homeSeed == 11) { // would play 3 or 14 next
                        for (Game otherGame : allGames) {
                            if (otherGame.getRegion().equals(region) && otherGame.getRound().equals(TournamentRound.ROUND_OF_64)) {
                                if (otherGame.getSeed1() == 3 || otherGame.getSeed2() == 14) {
                                    
                                        createNewGame(TournamentRound.ROUND_OF_32, region, game, otherGame, allGames, createdGameKeys);
                                    
                                }
                            }
                        }
                    }
                    
                    if (homeSeed == 7 || homeSeed == 10) { // would play 2 or 15 next
                        for (Game otherGame : allGames) {
                            if (otherGame.getRegion().equals(region) && otherGame.getRound().equals(TournamentRound.ROUND_OF_64)) {
                                if (otherGame.getSeed1() == 2 || otherGame.getSeed2() == 15) {
                                    
                                        createNewGame(TournamentRound.ROUND_OF_32, region, game, otherGame, allGames, createdGameKeys);
                                    
                                }
                            }
                        }
                    }



                }


                ////////////////////////ROUND OF 32 ->> ROUND OF 16
                else if (game.getRound().equals(TournamentRound.ROUND_OF_32)) {


                    if (homeSeed == 1 || homeSeed == 16 || homeSeed == 8 || homeSeed == 9) { // would play 5,12,4,13 next
                        // check corresponding next matchup winner, is it set?
                        
                        for (Game otherGame : allGames) {
                            int otherGameHomeSeed = otherGame.getSeed1();
                            int otherGameAwaySeed = otherGame.getSeed2();
                            if (otherGame.getRegion().equals(region) && otherGame.getRound().equals(TournamentRound.ROUND_OF_32) && game.getId() < otherGame.getId()) {
                                if (otherGameHomeSeed == 5 || otherGameHomeSeed == 12 || otherGameHomeSeed == 4 || otherGameHomeSeed == 13) {
                                        createNewGame(TournamentRound.SWEET_16, region, game, otherGame, allGames, createdGameKeys);
                                }
                            }
                        }
                    }

                    if (homeSeed == 6 || homeSeed == 11 || homeSeed == 3 || homeSeed == 14) { // would play 5,12,4,13 next
                        // check corresponding next matchup winner, is it set?
                        for (Game otherGame : allGames) {
                            int otherGameHomeSeed = otherGame.getSeed1();
                            int otherGameAwaySeed = otherGame.getSeed2();
                            if (otherGame.getRegion().equals(region) && otherGame.getRound().equals(TournamentRound.ROUND_OF_32) && game.getId() < otherGame.getId()) {
                                if (otherGameHomeSeed == 7 || otherGameHomeSeed == 10 || otherGameHomeSeed == 2 || otherGameHomeSeed == 15) {
                                        createNewGame(TournamentRound.SWEET_16, region, game, otherGame, allGames, createdGameKeys);
                                }
                            }
                        }
                    }

                }
                
                
                ///////////////////ROUND OF 16 ->>>>> ROUND Of 8
                else if (game.getRound().equals(TournamentRound.SWEET_16)) {
                    for (Game otherGame : allGames) {
                        if (otherGame.getRound().equals(TournamentRound.SWEET_16) &&
                            otherGame.getRegion().equals(region) &&
                            game.getId() < otherGame.getId()) {
                
                            // Same region, Round of 16, distinct games — try pairing
                            createNewGame(TournamentRound.ELITE_8, region, game, otherGame, allGames, createdGameKeys);
                        }
                    }
                }
                
                else if (game.getRound().equals(TournamentRound.ELITE_8)) {
                    for (Game otherGame : allGames) {
                        if (otherGame.getRound().equals(TournamentRound.ELITE_8)) {
                            boolean southVsWest = (game.getRegion().equals("South") && otherGame.getRegion().equals("West"))
                               || (game.getRegion().equals("West") && otherGame.getRegion().equals("South"));


                            boolean eastVsMidwest = (game.getRegion().equals("East") && otherGame.getRegion().equals("Midwest"))
                                || (game.getRegion().equals("Midwest") && otherGame.getRegion().equals("East"));

                            

                            if (southVsWest && game.getId() < otherGame.getId()) {
                                createNewGame(TournamentRound.FINAL_4, "SouthVsWest", game, otherGame, allGames, createdGameKeys);
                            }
                            else if (eastVsMidwest && game.getId() < otherGame.getId()) {
                                createNewGame(TournamentRound.FINAL_4, "EastVsMidwest", game, otherGame, allGames, createdGameKeys);
                            }

                        }
                    }
                
                }
                
                else if (game.getRound().equals(TournamentRound.FINAL_4)) {
                    for (Game otherGame : allGames) {
                        if (otherGame.getRound().equals(TournamentRound.FINAL_4)) {
                            if (game.getId() < otherGame.getId()) {
                                createNewGame(TournamentRound.CHAMPIONSHIP, "championship", game, otherGame, allGames, createdGameKeys);

                            }

                        }
                    }
                }
                


            }

        }

    }


    public void createNewGame(TournamentRound nextRound, String region, Game game1, Game game2, List<Game> allGames, Set<String> createdGameKeys) {
        if (game1.getWinner() == null || game2.getWinner() == null) return;
    
        // Get winner names
        String winner1 = game1.getWinner();
        String winner2 = game2.getWinner();
    
        // Prevent duplicate by team combo
        String matchupKey = winner1.compareTo(winner2) < 0 ? winner1 + "_" + winner2 : winner2 + "_" + winner1;
        if (createdGameKeys.contains(matchupKey)) return;
        createdGameKeys.add(matchupKey);
    
        // Determine bracket info
        BracketMapping bracketMap = mapWinner(game1, game2);
        String bracketTag = bracketMap.getBracketTag();
        int bracketNum = bracketMap.getBracketNum();
    
        // Prevent invalid bracketTag
        if (bracketTag == null || bracketTag.isBlank()) {
            System.out.println("Skipping game creation: invalid bracketTag for " + winner1 + " vs " + winner2);
            return;
        }
    
        // Prevent duplicate by bracket tag
        String bracketTagKey = "bracket_" + bracketTag;
        if (createdGameKeys.contains(bracketTagKey)) {
            System.out.println("Skipping duplicate bracketTag: " + bracketTag);
            return;
        }
        createdGameKeys.add(bracketTagKey);
    
        // Final DB-level check
        if (doesGameAlreadyExist(bracketTag)) {
            System.out.println("Skipping game creation: bracketTag already in DB: " + bracketTag);
            return;
        }
    
        // Assign seeds
        int seed1 = winner1.equals(game1.getHomeTeam()) ? game1.getSeed1() : game1.getSeed2();
        int seed2 = winner2.equals(game2.getHomeTeam()) ? game2.getSeed1() : game2.getSeed2();
        // Create and save game
        Game newGame = new Game(
            nextRound, region,
            seed1, winner1,
            seed2, winner2,
            "TBD", "TBD",
            0.0, 0.0,
            bracketTag, bracketNum
        );
    
        gameRepository.save(newGame);
    }


    /**
     * Helper for avoiding duplicate db entries
     * @param round
     * @param region
     * @param team1
     * @param team2
     * @return
     */
    private boolean doesGameAlreadyExist(String bracketTag) {
        return gameRepository.existsByBracketTag(bracketTag);
    }





    /**
     * 
     * @param game1
     * @param game2
     * @return
     * 
     */
    public BracketMapping mapWinner(Game game1, Game game2) {
        String game1Tag = game1.getBracketTag();
        int game1Num = game1.getBracketNum();
        String game1Region = game1.getRegion();

        String game2Tag = game2.getBracketTag();
        int game2Num = game2.getBracketNum();
        String game2Region = game2.getRegion();

        String newBracketTag = "";
        int newBracketNum = -1;
        if (game1Region.equals(game2Region) && game1Region.equals("East")) {
            newBracketNum = calcBracketNum(game1Num, game2Num);
            
            newBracketTag = "E" + newBracketNum;
        }   


        if (game1Region.equals(game2Region) && game1Region.equals("West")) {
            newBracketNum = calcBracketNum(game1Num, game2Num);
            newBracketTag = "W" + newBracketNum;
        }


        if (game1Region.equals(game2Region) && game1Region.equals("Midwest")) {
            newBracketNum = calcBracketNum(game1Num, game2Num);
            newBracketTag = "M" + newBracketNum;
        }


        if (game1Region.equals(game2Region) && game1Region.equals("South")) {
            newBracketNum = calcBracketNum(game1Num, game2Num);
            newBracketTag = "S" + newBracketNum;
        }

        // Final 4 matchup with winners of South and West regions
        if ((game1Region.equals("South") && game2Region.equals("West")) || (game1Region.equals("West") && game2Region.equals("South"))) {
            newBracketNum = calcBracketNum(game1Num, game2Num);
            newBracketTag = "SW" + newBracketNum;
        }

        if ((game1Region.equals("Midwest") && game2Region.equals("East")) || (game1Region.equals("East") && game2Region.equals("Midwest"))) {
            newBracketNum = calcBracketNum(game1Num, game2Num);
            newBracketTag = "EM" + newBracketNum;
        }

        if ((game1Region.equals("EastVsMidwest") && game2Region.equals("SouthVsWest")) ||
            (game1Region.equals("SouthVsWest") && game2Region.equals("EastVsMidwest"))) {
            newBracketNum = 17;
            newBracketTag = "Championship";
        }


        
        // save new game.
        return new BracketMapping(newBracketTag, newBracketNum);
    }




    /* 
    // 64 -> 32

        //1 + 2 = 9
        

        //3 + 4 = 10
        //5 + 6 = 11
        //7 + 8 = 12

    // 32 -> 16
        //9 + 10 = 13
        //11 + 12 = 14

    // 16 -> 8
        //13 + 14 = 15


    // 8 -> 4
        // S15 + W15 = EM16 or SW16

    // 4 -> champtionship
        // 16SW + 16EM = champtionship17

    */
    /**
     * 
     * @param num1
     * @param num2
     * @return
     */
    public int calcBracketNum(int num1, int num2) {
        if ((num1 == 1 && num2 == 2) || (num2 == 1 && num1 == 2) ) {
            return 9;
        }
        else if ((num1 == 3 && num2 == 4) || (num2 == 4 && num1 == 3)) {
            return 10;
        }
        else if ((num1 == 5 && num2 == 6) || (num2 == 5 && num1 ==6)) {
            return 11;
        }
        else if ((num1 == 7 && num2 == 8) || (num2 == 7 && num1 == 8)) {
            return 12;
        }
        else if ((num1 == 9 && num2 == 10) || (num2 == 9 && num1 == 10)) {
            return 13;
        }
        else if ((num1 == 11 && num2 == 12) || (num2 == 11 && num1 == 12)) {
            return 14;
        }
        else if ((num1 == 13 && num2 == 14) || (num2 == 13 && num1 == 14)) {
            return 15;
        }

        else if (num1 == 15 && num2 == 15) {
            return 16;
        }
        else if (num1 == 16 && num2 == 16) {
            return 17;
        }
        else {
            System.out.println("Error in calcBracketNum: num1 = " + num1 + " : num2 = " + num2);
            return -1;
        }
    }
}
