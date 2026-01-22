import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/LOGO.png';
import { Col, Container, Row } from "react-bootstrap";
import GameCard from './components/NBAGameCard';
import GameModal from './components/NBAGameModal';
import BetModal from './components/NBABetModal';
import TopNavbar from './components/TopNavbar';
import './betthebracket-app.css';

function NbaGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGameModal, setShowGameModal] = useState(false);
    const [showBetModal, setShowBetModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    const handleShow = (game) => {
        setShowGameModal(true);
        setSelectedGame(game);
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

    useEffect(() => {
        fetch('http://localhost:8080/nba/odds', { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setGames(data || []);
                setLoading(false);
            })
            .catch(error => {
                console.log("Error in catch: ", error);
                setGames([]);
                setLoading(true);
            });
    }, []);

    useEffect(() => {}, [showGameModal]);

    const upcomingGames = games.filter(game => game.status !== "finished");
    const finishedGames = games.filter(game => game.status === "finished");

    return (
        <div>
            <TopNavbar />
            <h1>Games</h1>

            {showGameModal && (
                <GameModal 
                    showGameModal={showGameModal} 
                    onClose={handleGameClose} 
                    onBet={handleCloseAndOpenBet}
                    game={selectedGame}
                />
            )}

            {showBetModal && (
                <BetModal
                    showBetModal={showBetModal} 
                    onClose={handleBetClose}
                    onBet={handleBetMade}
                    game={selectedGame}
                    sport="NBA"
                />
            )}

            <Container fluid>
                <h3 className="mt-3 mb-3">Upcoming Games</h3>
                <Row>
                    {!loading && upcomingGames.length > 0 ? (
                        upcomingGames.map((game, index) => (
                            <Col xs={6} md={4} lg={3} key={index}>
                                <GameCard
                                    {...game}
                                    onClick={() => handleShow(game)}
                                />
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <p className="text-muted">No upcoming games.</p>
                        </Col>
                    )}
                </Row>

                <hr className="my-4" />

                <h3 className="mt-3 mb-3">Finished Games</h3>
                <Row>
                    {!loading && finishedGames.length > 0 ? (
                        finishedGames.map((game, index) => (
                            <Col xs={6} md={4} lg={3} key={index}>
                                <GameCard
                                    {...game}
                                    onClick={() => handleShow(game)}
                                />
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <p className="text-muted">No finished games.</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default NbaGames;
