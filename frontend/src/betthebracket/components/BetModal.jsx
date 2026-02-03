import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal, Form, ButtonGroup, ToggleButton } from "react-bootstrap"

function BetModal(props) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [authToken, setAuthToken] = useState('');
  


  useEffect(() => {
    setSelectedTeam('');
    setBetAmount('');
    let token = localStorage.getItem('token');
    setAuthToken(token);
  }, [props.showBetModal]);

  function calculatePotentialPay(odds, betAmount) {
    let payout, totalReturn;
    if (odds < 0) {
      payout = betAmount * (100 / Math.abs(odds))
      totalReturn = betAmount + payout
    }
    else if (odds > 0) {
      payout = betAmount * (odds / 100);
      totalReturn = betAmount + payout;
    }
    return totalReturn;
  }

  const handleSubmitBet = async () => {
    const amount = parseFloat(betAmount);
    
    //error message here
    let odds;
    if (selectedTeam === props.game.homeTeam) {
      odds = props.game.homeOdds;
    }
    else {
      odds = props.game.awayOdds;
    }


    const potentialPay = calculatePotentialPay(odds, amount);

    const betData = {
        authToken: authToken,
        odds: odds,
        gameId: props.game.id,
        teamPicked: selectedTeam,
        amount: amount,
        potentialPay: potentialPay,
        sport: props.sport,
        betType: "h2h"
      };
    try {
        const response = await fetch('/api/betthebracket/bets/place', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(betData),
        });
        if (response.ok) {
          props.onBet();
        }
        else {
          const err = await response.text();
          console.error("Error:", err);
        }
    }
    catch(error) {
        console.error("Network error:", error);
    }
  };

  
  

  

    return (
      <Modal show={props.showBetModal} onHide={props.onClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Betting Information</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <h5>Select team to win:</h5>
            <ButtonGroup className='mb-3'>
              <ToggleButton key="home" id="home_button" type="radio" 
                variant={selectedTeam === props.game.homeTeam ? 'primary' : 'outline-primary'}
                name="team"
                value={props.game.homeTeam}
                checked={selectedTeam === props.game.homeTeam}
                onChange={(e) => setSelectedTeam(e.currentTarget.value)}
              >
                {props.game.homeTeam} ({props.game.seed1}) — Odds: {props.game.homeOdds}
              </ToggleButton>

              <ToggleButton key="away" id="away_button" type="radio" 
                variant={selectedTeam === props.game.awayTeamTeam ? 'primary' : 'outline-primary'}
                name="team"
                value={props.game.awayTeam}
                checked={selectedTeam === props.game.awayTeam}
                onChange={(e) => setSelectedTeam(e.currentTarget.value)}
              >
              {props.game.awayTeam} ({props.game.seed2}) — Odds: {props.game.awayOdds}
              </ToggleButton>
            </ButtonGroup>
            <Form.Control
            type="number"
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmitBet}>
          Make A Bet
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BetModal;