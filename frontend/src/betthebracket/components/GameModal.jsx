import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal } from "react-bootstrap"
import './GameModal.css'

function GameModal(props) {
    useEffect(() => {
  }, [props.showGameModal]);
    const leftTeamWon = props.game.winner === props.game.homeTeam;
    const rightTeamWon = props.game.winner === props.game.awayTeam;
    const isFinished = props.game.status === "finished";
    return (
      <Modal show={props.showGameModal} onHide={props.onClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>More Game Information</Modal.Title>
        </Modal.Header>
        {props.game.bracketTag ? ( // info to show for march madness games.
          <Modal.Body>
            <p>{props.game.homeTeam + " ("}<strong>{props.game.seed1}</strong>{") vs. " + props.game.awayTeam + " ("}<strong>{props.game.seed2}</strong>{")"}</p>
            <p><strong>Round: </strong>{props.game.round}</p>
            <p><strong>Date: </strong>{props.game.date === "TBD" ? "Finished" : "TBD"}</p>
            <p><strong>Region: </strong>{props.game.region}</p>
            <p><strong>Status: </strong>{(props.game.status === "finished") ? "Finished" : "Upcoming"}</p>
            {props.game.winner !== "TBD" && <p><strong>Winner: </strong>{props.game.winner}</p>}
          </Modal.Body>
        ) : ( // info to show for regular cbb games.
          <Modal.Body> 
            <div className='cbb-game-modal-body'>
              <p className='cbb-left-team-title'><strong>{props.game.homeTeam}</strong></p>
              <p className='vs'>vs</p>
              <p className='cbb-right-team-title'><strong>{props.game.awayTeam}</strong></p>
              <div className={`cbb-left-score-div ${isFinished ? (leftTeamWon ? "win" : "loss") : ""}`}>
                <p className='left-score'>{props.game.homeScore}</p>
              </div>
              <div className={`cbb-right-score-div ${isFinished ? (rightTeamWon ? "win" : "loss") : ""} `}>
                <p className='right-score'>{props.game.awayScore}</p>
              </div>
              <p className='cbb-game-start-time'>{props.game.displayDate}</p>
              <p className='cbb-game-status'><strong>Status: </strong>{(props.game.status === "finished") ? "Finished" : "Upcoming"}</p>
              {props.game.winner !== null && <p className='cbb-game-winner'><strong>Winner: </strong>{props.game.winner}</p>}
            </div>
          </Modal.Body>
        )}
        


        <Modal.Footer>
          {(props.game.status === "finished") &&
          <p>Match complete. Bets closed</p>
          }
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
          <Button disabled={isFinished} variant="primary" onClick={props.onBet}
            style={{background: props.game.status === "finished" ? "red" : "blue"}}>
            Open Bet
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default GameModal;