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
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [inProgressGames, setInProgressGames] = useState([]);
    const [finishedGames, setFinishedGames] = useState([]);
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
                const addFields = data.map(game => {
                    const date = new Date(game.startTime);

                    return {
                        ...game,
                        startDate: date,
                        displayDate: date.toLocaleString("en-US", { // use CST/CDT timezone
                            timeZone: "America/Chicago",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit"
                        }),
                        timestamp: date.getTime()
                    };
                });
                console.log(addFields); ////////////
                setGames(addFields);

                const now = Date.now();
                setInProgressGames(addFields.filter(g => g.status === "scheduled" && g.timestamp <= now).sort((a, b) => a.timestamp - b.timestamp));
                setUpcomingGames(addFields.filter(g => g.status === "scheduled" && g.timestamp > now).sort((a, b) => a.timestamp - b.timestamp));
                setFinishedGames(addFields.filter(g => g.status === "finished").sort((a, b) => b.timestamp - a.timestamp));

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
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <TopNavbar/>
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
            <Container fluid style={{ marginTop: "10vh"}}>
                <Row className='in-progress-row'>
                    <h3>In Progress Games</h3>
                    <hr></hr>
                    {inProgressGames ? inProgressGames.map((game, index) => {
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
                    }) : <h3>In-Progress Games Failed to Load</h3>}
                    <hr></hr>
                </Row>
                <Row className='upcoming-row'>
                    <h3>Upcoming Games</h3>
                    <hr></hr>
                    {upcomingGames ? upcomingGames.map((game, index) => {
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
                    <hr></hr>
                </Row>
                <Row className='finished-row'>
                    <h3>Finished Games</h3>
                    <hr></hr>
                    {finishedGames ? finishedGames.map((game, index) => {
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