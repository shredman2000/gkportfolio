import React from "react";
import { Container } from "react-bootstrap";
import GameCard from "./GameCard";
import "./betthebracket-bracket.css";

export default function MarchMadnessBracket({ games, onGameClick }) {
    const rounds = ["Round of 64", "Round of 32", "Round of 16", "Round of 8"];
    const leftRegions = ["West", "South"];
    const rightRegions = ["East", "Midwest"];

    console.log(games);

    const getGames = (round, regions) =>
        games.filter(g => g.round === round && regions.includes(g.region));

    const getFinalFour = () => games.filter(g => g.round === "Final 4");

    console.log(getFinalFour())
    const getChampionship = () => games.filter(g => g.round === "Championship");

    const finalFourLeft = getFinalFour().filter(g => g.region === "SouthVsWest");
    const finalFourRight = getFinalFour().filter(g => g.region === "EastVsMidwest");

    console.log(finalFourLeft)

    return (
        <Container fluid className="bracket-container">
            <h2 className="text-center my-4">March Madness Bracket</h2>
            <div className="bracket-grid">
                {/* LEFT SIDE */}
                {rounds.map(round => (
                    <div className={`bracket-column round-${round.split(" ")[2]}`} key={`left-${round}`}>
                        <h6 className="text-center">{round}</h6>
                        {getGames(round, leftRegions).map(game => (
                            <div className="bracket-game" key={game.id}>
                                <GameCard {...game} onClick={() => onGameClick(game)} tinyCard={true} />
                            </div>
                        ))}
                    </div>
                ))}

                {/* FINAL FOUR LEFT */}
                <div className="bracket-column final-four">
                    <h6 className="text-center">Final Four</h6>
                    {finalFourLeft.map(game => (
                        <div className="bracket-game" key={game.id}>
                            <GameCard {...game} onClick={() => onGameClick(game)} tinyCard={true} />
                        </div>
                    ))}
                </div>

                {/* CHAMPIONSHIP CENTER */}
                <div className="bracket-column center">
                    <h6 className="text-center">Championship</h6>
                    {getChampionship().map(game => (
                        <div className="bracket-game" key={game.id}>
                            <GameCard {...game} onClick={() => onGameClick(game)} tinyCard={true} />
                        </div>
                    ))}
                </div>

                {/* FINAL FOUR RIGHT */}
                <div className="bracket-column final-four">
                    <h6 className="text-center">Final Four</h6>
                    {finalFourRight.map(game => (
                        <div className="bracket-game" key={game.id}>
                            <GameCard {...game} onClick={() => onGameClick(game)} tinyCard={true} />
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDE */}
                {[...rounds].reverse().map(round => (
                    <div className={`bracket-column round-${round.split(" ")[2]}`} key={`right-${round}`}>
                        <h6 className="text-center">{round}</h6>
                        {getGames(round, rightRegions).map(game => (
                            <div className="bracket-game" key={game.id}>
                                <GameCard {...game} onClick={() => onGameClick(game)} tinyCard={true} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Container>
    );
}
