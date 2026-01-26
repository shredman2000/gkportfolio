import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/LOGO.png'
import { Col, Container, Row } from "react-bootstrap";
import GameCard from './components/GameCard';
import GameModal from './components/GameModal';
import BetModal from './components/BetModal';
import TopNavbar from './components/TopNavbar';
import './betthebracket-app.css';

function Games() {
    const [games, setGames] = useState([]);
    //const [loading, setLoading] = useState(true);
    const [showGameModal, setShowGameModal] = useState(false)
    const [showBetModal, setShowBetModal] = useState(false)
    const [selectedGame, setSelectedGame] = useState([])
    const handleShow = (game) => {
        setShowGameModal(true)
        setSelectedGame(game)
    }
    const handleGameClose = () => setShowGameModal(false)
    const handleBetClose = () => {
        setShowBetModal(false)
    }
    const handleBetMade = () => {
        console.log("Bet made")
        setShowBetModal(false)
    }
    const handleCloseAndOpenBet = () => {
        setShowGameModal(false)
        setShowBetModal(true)
    }

    useEffect(() => {
        fetch('/api/betthebracket/games/fetchCBB')
            .then(response => {
                if (!response.ok) { throw new Error(`${response.status}`)}

                    return response.json()
                })
            .then(data => {
                setGames(data);
                //setLoading(false);
                //console.log(data);
            })
            .catch(error => {
                console.log("Error in catch: " + error)
                //setLoading(true);
                setGames([]);
            });
    }, []);

    useEffect(() => {
      }, [showGameModal]);

    return ( 
        <div>
            <TopNavbar/>
            <h1>Games</h1>
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
                sport="CBB"
            />}
            <Container fluid>
                <Row>
                    {games ? games.map((game, index) => {
                        return <Col 
                        xs={6}
                        md={4}
                        lg={3}
                        key={index}
                        >
                            <GameCard
                                {...game}
                                onClick={() => handleShow(game)}
                                />
                        </Col>
                    }
                    ) :
                    <h3>Games failed to load.</h3> 
                    }
                </Row>
            </Container>
    </div>
)}

export default Games;