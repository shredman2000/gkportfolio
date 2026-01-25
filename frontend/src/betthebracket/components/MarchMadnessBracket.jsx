import React, { useCallback, useRef } from "react";
import { Container } from "react-bootstrap";
import { StyleSheetManager } from 'styled-components';
import GameCard from "./GameCard";
import useComponentSize from '@rehooks/component-size';
import "./betthebracket-bracket.css";
import teamColors from "../resources/teamColors.json";
import { SingleEliminationBracket, SVGViewer, MATCH_STATES, createTheme } from '@g-loot/react-tournament-brackets'


const theme = createTheme({
    textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
    matchBackground: {
        wonColor: '#E6F2FF',
        lostColor: '#F2F2F2',
    },
    score: {
        background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
        text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
    },
    border: {
        color: '#CED1F2',
        highlightedColor: '#da96c6',
    },
    roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
    connectorColor: '#CED1F2',
    connectorColorHighlight: '#da96c6',
    svgBackground: '#FAFAFA',
})
const getTeamColor = (teamName) => teamColors[teamName]?.primary || "#888";
const getTeamSecondaryColor = (teamName) => teamColors[teamName]?.secondary || "#888";
const getRoundLabel = (roundKey) => {
    switch (roundKey) {
        case "ROUND_OF_64":
        return "of 64";
        case "ROUND_OF_32":
        return "of 32";
        case "SWEET_16":
        return "of 16";
        case "ELITE_8":
        return "of 8";
        case "FINAL_4":
        return "Final Four";
        case "CHAMPIONSHIP":
        return "Championship";
        default:
        return roundKey;
    }
};

const formatData = (games) => {    
    const idByBracketTag = Object.fromEntries(
        games.map(g => [g.bracketTag, g.id])
    );
    return games.map((g) => ({
        id: g.id,
        name: `${g.region}`,
        nextMatchId: nextMatchMap[g.bracketTag]
            ? idByBracketTag[nextMatchMap[g.bracketTag]]
            : null,
        tournamentRoundText: getRoundLabel(g.round),
        startTime: g.status === "finished" ? "Final" : g.status,
        state: g.status === "finished"
                ? MATCH_STATES.DONE
                : MATCH_STATES.UPCOMING,
        participants: [
            {
                id: `home-${g.id}`,
                name: g.homeTeam,
                resultText: g.winner === g.homeTeam ? "Won" : "",
                isWinner: g.winner === g.homeTeam,
                status: null,
                score: g.homeTeam.score
            },
            {
                id: `away-${g.id}`,
                name: g.awayTeam,
                resultText: g.winner === g.awayTeam ? "Won" : "",
                isWinner: g.winner === g.awayTeam,
                status: null,
            }
        ]

    }))
}


const rounds = [
    { key: "ROUND_OF_64", label: "Round of 64" },
    { key: "ROUND_OF_32", label: "Round of 32" },
    { key: "SWEET_16", label: "Round of 16" },
    { key: "ELITE_8",  label: "Round of 8" },
    { key: "FINAL_4", label: "Final Four" },
    { key: "CHAMPIONSHIP", label: "Championship" }
];

const nextMatchMap = {
  // East
  "roundOf64_E1": "E9",
  "roundOf64_E2": "E9",
  "roundOf64_E3": "E10",
  "roundOf64_E4": "E10",
  "roundOf64_E5": "E11",
  "roundOf64_E6": "E11",
  "roundOf64_E7": "E12",
  "roundOf64_E8": "E12",

  // Midwest
  "roundOf64_M1": "M9",
  "roundOf64_M2": "M9",
  "roundOf64_M3": "M10",
  "roundOf64_M4": "M10",
  "roundOf64_M5": "M11",
  "roundOf64_M6": "M11",
  "roundOf64_M7": "M12",
  "roundOf64_M8": "M12",

  // South
  "roundOf64_S1": "S9",
  "roundOf64_S2": "S9",
  "roundOf64_S3": "S10",
  "roundOf64_S4": "S10",
  "roundOf64_S5": "S11",
  "roundOf64_S6": "S11",
  "roundOf64_S7": "S12",
  "roundOf64_S8": "S12",

  // West
  "roundOf64_W1": "W9",
  "roundOf64_W2": "W9",
  "roundOf64_W3": "W10",
  "roundOf64_W4": "W10",
  "roundOf64_W5": "W11",
  "roundOf64_W6": "W11",
  "roundOf64_W7": "W12",
  "roundOf64_W8": "W12",

  // Round of 32 → Sweet 16
  "E9": "E13",
  "E10": "E13",
  "E11": "E14",
  "E12": "E14",
  "M9": "M13",
  "M10": "M13",
  "M11": "M14",
  "M12": "M14",
  "S9": "S13",
  "S10": "S13",
  "S11": "S14",
  "S12": "S14",
  "W9": "W13",
  "W10": "W13",
  "W11": "W14",
  "W12": "W14",

  // Sweet 16 → Elite 8
  "E13": "E15",
  "E14": "E15",
  "M13": "M15",
  "M14": "M15",
  "S13": "S15",
  "S14": "S15",
  "W13": "W15",
  "W14": "W15",

  // Elite 8 → Final 4
  "E15": "EM16", // East winner
  "M15": "EM16", // Midwest winner
  "S15": "SW16", // South winner
  "W15": "SW16", // West winner

  // Final 4 → Championship
  "EM16": "Championship",
  "SW16": "Championship"
};

export default function MarchMadnessBracket({ games, onGameClick }) {
    const ref = useRef(null);
    const { width, height } = useComponentSize(ref);
    const matches = formatData(games);

    const svgWrapper = useCallback(
        ({ children, ...props}) => (
            <SVGViewer width={width} height={height} {...props}
            >
                {children}
            </SVGViewer>
        ), [width, height]
    );




    return (
        <div ref={ref} className="bracket-wrapper" style={{ width: '100vw', height: '75vh' }}>
            <SingleEliminationBracket
                matches={matches}
                svgWrapper={svgWrapper}
                matchComponent={({
                    match,
                    onMatchClick,
                    onPartyClick,
                    onMouseEnter,
                    onMouseLeave,
                    topParty,
                    bottomParty,
                    topWon,
                    bottomWon,
                    topHovered,
                    bottomHovered,
                    topText,
                    bottomText,
                    teamNameFallback,
                    resultFallback,
                    }) => {
                    const borderColor = (hovered) =>
                        hovered ? '#FF8C00' : '#ccc';

                    const matchBg = (won) =>
                        won ? '#E8F5E9' : '#F5F5F5';

                    const scoreBg = (won) =>
                        won ? '#2E7D32' : '#BDBDBD';

                    const textColor = (won) =>
                        won ? '#fff' : '#000';
                    const topPrimaryColor = getTeamColor(topParty.name);
                    const bottomPrimaryColor = getTeamColor(bottomParty.name);

                    const topBackground = topPrimaryColor 
                        ? `linear-gradient(to right, #FFFFFF 30%, ${topPrimaryColor})`
                        : "#FFFFFF";

                    const bottomBackground = bottomPrimaryColor
                        ? `linear-gradient(to right, #FFFFFF 30%, ${bottomPrimaryColor})`
                        : "#FFFFFF";

                    return (
                        <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            fontFamily: 'sans-serif',
                        }}
                        onClick={() => onGameClick?.(match)}
                        >
                        {/* Top text */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: 12 }}>{topText}</div>

                            {(match.href || onMatchClick) && (
                            <a
                                href={match.href}
                                onClick={(e) =>
                                onMatchClick?.({ match, topWon, bottomWon, event: e })
                                }
                                style={{
                                fontSize: 12,
                                cursor: 'pointer',
                                textDecoration: 'none',
                                }}
                            >
                                Match Details
                            </a>
                            )}
                        </div>

                        {/* Match body */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {/* Top side */}
                            <div
                            onMouseEnter={() => onMouseEnter(topParty.id)}
                            onMouseLeave={onMouseLeave}
                            onClick={() => onPartyClick?.(topParty, topWon)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 0 6px 12px',
                                background: topBackground,
                                borderLeft: `4px solid ${borderColor(topHovered)}`,
                                borderRight: `4px solid ${borderColor(topHovered)}`,
                                borderTop: `1px solid ${borderColor(topHovered)}`,
                                cursor: 'pointer',
                            }}
                            >
                            <div>{topParty?.name || teamNameFallback}</div>
                            <div
                                style={{
                                width: 40,
                                textAlign: 'center',
                                background: scoreBg(topWon),
                                color: textColor(topWon),
                                }}
                            >
                                {topParty?.resultText ?? resultFallback(topParty)}
                            </div>
                            </div>

                            {/* Divider */}
                            <div
                            style={{
                                height: 1,
                                background:
                                topHovered || bottomHovered ? '#FF8C00' : '#ccc',
                            }}
                            />

                            {/* Bottom side */}
                            <div
                            onMouseEnter={() => onMouseEnter(bottomParty.id)}
                            onMouseLeave={onMouseLeave}
                            onClick={() => onPartyClick?.(bottomParty, bottomWon)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 0 6px 12px',
                                background: bottomBackground,
                                borderLeft: `4px solid ${borderColor(bottomHovered)}`,
                                borderRight: `4px solid ${borderColor(bottomHovered)}`,
                                borderBottom: `1px solid ${borderColor(bottomHovered)}`,
                                cursor: 'pointer',
                            }}
                            >
                            <div>{bottomParty?.name || teamNameFallback}</div>
                            <div
                                style={{
                                width: 40,
                                textAlign: 'center',
                                background: scoreBg(bottomWon),
                                color: textColor(bottomWon),
                                }}
                            >
                                {bottomParty?.resultText ?? resultFallback(bottomParty)}
                            </div>
                            </div>
                        </div>

                        {/* Bottom text */}
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                            {bottomText ?? ' '}
                        </div>
                        </div>
                    );
                    }}

                />
        </div>
    );
}
