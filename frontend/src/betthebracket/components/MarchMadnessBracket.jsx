import React from "react";
import { Container } from "react-bootstrap";
import GameCard from "./GameCard";
import "./betthebracket-bracket.css";

export default function MarchMadnessBracket({ games, onGameClick }) {
    const leftRegions = ["West", "South"];
    const rightRegions = ["East", "Midwest"];

    console.log(games);

    const rounds = [
        { key: "ROUND_64", label: "Round of 64" },
        { key: "ROUND_32", label: "Round of 32" },
        { key: "ROUND_16", label: "Round of 16" },
        { key: "ROUND_8",  label: "Round of 8" },
        { key: "FINAL_4", label: "Final Four" },
        { key: "CHAMPIONSHIP", label: "Championship" }
    ];


    const getGames = (roundKey, regions) =>
        games.filter(g => g.round === roundKey && regions.includes(g.region));

    const getFinalFour = () => games.filter(g => g.round === "FINAL_4");

    console.log("Final four: " + getFinalFour())
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
                    <div className={`bracket-column round-${round.label.split(" ")[2]}`} key={`left-${round.key}`}>
                        <h6 className="text-center">{round.label}</h6>
                        {getGames(round.key, leftRegions).map(game => (
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
                    <div className={`bracket-column round-${round.label.split(" ")[2]}`} key={`right-${round.key}`}>
                        <h6 className="text-center">{round.label}</h6>
                        {getGames(round.key, rightRegions).map(game => (
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
