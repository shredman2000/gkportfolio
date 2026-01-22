import React, { useState, useEffect } from "react";
import TopNavbar from './components/TopNavbar';
import GameModal from './components/GameModal';
import BetModal from './components/BetModal';
import MarchMadnessBracket from './components/MarchMadnessBracket';
import './betthebracket-app.css';

function Home() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGameModal, setShowGameModal] = useState(false);
    const [showBetModal, setShowBetModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        fetch('/api/betthebracket/games')
            .then(res =>  { 
                if (!res.ok) { throw new Error("response not ok") }
                return res.json() })
            .then(data => {
                setGames(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch games:", err);
                setLoading(true);
            });
    }, []);

    const handleShow = (game) => {
        setSelectedGame(game);
        setShowGameModal(true);
    };

    const handleGameClose = () => setShowGameModal(false);
    const handleBetClose = () => setShowBetModal(false);
    const handleBetMade = () => {
        console.log("Bet made");
        setShowBetModal(false);
    };
    const handleCloseAndOpenBet = () => {
        setShowGameModal(false);
        setShowBetModal(true);
    };

    return (
        <div>
            <TopNavbar />
            <div style={{ padding: "1rem" }}>
                <h1>Home</h1>
                <hr />
                {loading ? (
                    <h3>Loading bracket...</h3>
                ) : (
                    <MarchMadnessBracket games={games} onGameClick={handleShow} />
                )}

                {showGameModal &&
                    <GameModal
                        showGameModal={showGameModal}
                        onClose={handleGameClose}
                        onBet={handleCloseAndOpenBet}
                        game={selectedGame}
                    />}
                {showBetModal &&
                    <BetModal
                        showBetModal={showBetModal}
                        onClose={handleBetClose}
                        onBet={handleBetMade}
                        game={selectedGame}
                    />}
            </div>
        </div>
    );
}

export default Home;