import { React, useState, useEffect } from 'react';
import { Col, Container, Row, Card, Button, ListGroup, Modal, Form, CardBody, CardHeader, CardTitle } from "react-bootstrap";
import TopNavbar from './components/TopNavbar';
import './betthebracket-app.css';

function Profile( { setToken } ) {
    const [bets, setBets] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [transactionAmount, setTransactionAmount] = useState('')
    const [userBetData, setUserBetData] = useState({});

    //Modal handler
    const handleTransaction = async (type) => {
        // alter endpoint based on transaction type
        const endpoint = type === 'deposit'
            ? '/api/betthebracket/users/deposit'
            : '/api/betthebracket/users/withdraw';

        // submit transaction to backend via api call
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    authToken: localStorage.getItem('token'), 
                    amount: parseFloat(transactionAmount)
                })
            });

            if (response.ok) {
                // alert user of successful transaction
                const message = await response.text();
                alert(message);

                // Refresh balance after transaction
                fetch('/api/betthebracket/users/getUsernameAndBalance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ authToken: localStorage.getItem('token') })
                })
                .then(res => res.json())
                .then(data => setUserInfo(data))
                .catch(err => console.error('Error refreshing user info:', err));
            } else {
                console.error(`${type} error:`, error);
                alert("An error occurred. Please try again.");
            }

        } catch (error) {
            console.error('Error during transaction:', error);
            alert('Transaction failed. Please try again.');
        }

        setTransactionAmount(''); // Reset the input field
        setShowDepositModal(false); // Close the modal
        setShowWithdrawModal(false); // Close the modal
    }


    //Fetch the users existing bets
    useEffect(() => {
        //grab users auth token stored during login
        let authToken = localStorage.getItem('token');
        //console.log(authToken);

        fetch('/api/betthebracket/users/getBets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ authToken: authToken })
        }).then(response => response.json())
        .then(data => {
            setBets(data);
            //console.log(data);
        })
        .catch(error => {
            console.error('Error fetching bets:', error);
        });
    }, []); 
    
    //Fetch users username and balance to display on profile page
    useEffect(() => {
        let authToken = localStorage.getItem('token');

        fetch('/api/betthebracket/users/getUsernameAndBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ authToken: authToken })
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            setUserInfo(data);
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
    }, []); 

    useEffect(() => {
        let authToken = localStorage.getItem('token');
        fetch('/api/betthebracket/users/getBetStats', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({authToken: authToken})
        })
        .then(response => response.json())
        .then(data => { setUserBetData(data) })
        .catch(error => {
            console.error('error fetching users bet data: ',  error);
        })
    }, []);

    //Maps the bets fetched from the backend to a card component to display on the page
    const renderBetCard = (bet) => {
        let borderColor= 'border-warning'; // set border as yellow for open bets

        if (bet.status === 'won') borderColor = 'border-success';   // green for won bets
        else if (bet.status === 'lost') borderColor = 'border-danger'; // red for lost bets
        return (
            <ListGroup.Item key={bet.betId} className="mb-3">
                <Card className={`shadow-sm border-3 ${borderColor}`}>
                    <Card.Body>
                        <Card.Title>
                            {bet.awayTeam} @ {bet.homeTeam}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {bet.date} at {bet.time}
                        </Card.Subtitle>
                        <Card.Text>
                            <strong>Bet Type:</strong> {bet.betType} <br />
                            <strong>Odds:</strong> {bet.odds} <br />
                            <strong>Amount:</strong> ${bet.amount.toFixed(2)} <br />
                            <strong>To Pay: </strong> ${bet.potentialPay.toFixed(2)}<br />
                            <strong>Status:</strong> {bet.status}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </ListGroup.Item>
        );
    };

    //filter the bets by their isOpen field to display open and closed bets separately
    const openBets = bets.filter(bet => bet.openOrClosed === "open");
    const closedBets = bets.filter(bet => bet.openOrClosed == "closed");
    
    return <div>
        <TopNavbar setToken={setToken}/>
        <h1>Bets</h1>
        <hr/>
        <Container fluid>
            <Row>
                <Col md={8}>
                    <h3 className="mb-3">Current Bets</h3>
                    <ListGroup className="mb-5">
                        {openBets.length === 0 ? (
                            <ListGroup.Item className="text-muted">No open bets to display.</ListGroup.Item>
                        ) : (
                            openBets.map(renderBetCard)
                        )}
                    </ListGroup>    
                    <hr/>
                    <h3 className="mb-3">Past Bets</h3>
                    <ListGroup className="mb-5">
                        {closedBets.length === 0 ? (
                            <ListGroup.Item className="text-muted">No past bets to display.</ListGroup.Item>
                        ) : (
                            closedBets.map(renderBetCard)
                        )}
                    </ListGroup>
                </Col>
                

                {/* right column on profile, contains depo/withdrawal, bet stats, slot stats */}
                <Col md={4}>
                    <Card className="mb-4 p-3 shadow-sm">
                        <Card.Body>
                        <Card.Title>User: {userInfo.username}</Card.Title>
                        <Card.Text>
                            Balance: <strong>${(userInfo.balance * 1.0).toFixed(2)}</strong>
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                            <Button variant="success" className="me-2" onClick={() => setShowDepositModal(true)}>Deposit</Button>
                            <Button variant="danger" onClick={() => setShowWithdrawModal(true)}>Withdraw</Button>
                        </div>
                        </Card.Body>
                    </Card>

                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Betting Stats</Card.Title>

                            {bets.length === 0 ? (
                                <p className="text-muted">No betting history.</p>
                            ) : (
                                <>
                                    {/* Check for closed bets history */}
                                    {closedBets.length > 0 && (
                                        <div className="mb-2">
                                            {/* Calculate win rate */}
                                            {(() => {
                                                const wins = closedBets.filter(bet => bet.status === 'won').length;
                                                const totalClosed = closedBets.length;
                                                const winRate = (wins / totalClosed) * 100;
                                                return (
                                                    <p><strong>Win Rate:</strong> {winRate.toFixed(1)}%</p>
                                                );
                                            })()}
                                        </div>
                                    )}
                                    
                                    {/* Calculate most bet on team */}
                                    {(() => {
                                        const teamCounts = {};

                                        // Combine open and closed bets
                                        bets.forEach(bet => {
                                            const team = bet.teamPicked;
                                            if (team) {
                                                teamCounts[team] = (teamCounts[team] || 0) + 1;
                                            }
                                        });

                                        // Find team with max count
                                        const mostBetOnTeam = Object.keys(teamCounts).reduce((a, b) => teamCounts[a] > teamCounts[b] ? a : b, null);

                                        if (mostBetOnTeam) {
                                            return (
                                                <div>
                                                    <p><strong>Most Bet On Team:</strong> {mostBetOnTeam}</p>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <p className="text-muted">No team bets found.</p>
                                            );
                                        }
                                    })()}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="p-3 shadow-sm" style={{ marginTop: '25px'}}>
                        <CardBody>
                            <p style={{fontSize: '15pt'}}><strong>Total Wagered: </strong>${userBetData.totalWagered}</p>
                            <p style={{fontSize: '15pt'}}><strong>Total Profit: </strong>${userBetData.totalProfit}</p>
                            <p style={{fontSize: '15pt'}}><strong>Slot Wagered: </strong>${userBetData.totalSlotWagered}</p>
                            <p style={{fontSize: '15pt'}}><strong>Slot Profit: </strong>${userBetData.totalSlotProfit}</p>
                            <p style={{fontSize: '15pt'}}><strong>Slot Spins: </strong>{userBetData.totalSpins}</p>
                        </CardBody>

                    </Card>
                </Col>
            </Row>
        </Container>

        {/* Deposit Modal */}
            <Modal show={showDepositModal} onHide={() => {setShowDepositModal(false); setTransactionAmount('')}} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Deposit Funds</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="depositAmount">
                            <Form.Label>Enter amount to deposit:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Amount"
                                value={transactionAmount}
                                onChange={(e) => setTransactionAmount(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    
                <Button variant="success" onClick={() => handleTransaction('deposit')}>Submit</Button>
                    <Button variant="secondary" onClick={() => {setShowDepositModal(false); setTransactionAmount('');}}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Withdraw Modal */}
            <Modal show={showWithdrawModal} onHide={() => {setShowWithdrawModal(false); setTransactionAmount('');}} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Withdraw Funds</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="withdrawAmount">
                            <Form.Label>Enter amount to withdraw:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Amount"
                                value={transactionAmount}
                                onChange={(e) => setTransactionAmount(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleTransaction('withdraw')}>Submit</Button>
                    <Button variant="secondary" onClick={() => {setShowWithdrawModal(false); setTransactionAmount('');}}>Cancel</Button>
                </Modal.Footer>
            </Modal>

    </div>
}

export default Profile;