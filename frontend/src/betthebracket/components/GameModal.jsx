import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal } from "react-bootstrap"

function GameModal(props) {
    useEffect(() => {
  }, [props.showGameModal]);

    return (
      <Modal show={props.showGameModal} onHide={props.onClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>More Game Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{props.game.homeTeam + " ("}<strong>{props.game.seed1}</strong>{") vs. " + props.game.awayTeam + " ("}<strong>{props.game.seed2}</strong>{")"}</p>
          <p><strong>Round: </strong>{props.game.round}</p>
          <p><strong>Date: </strong>{props.game.date}</p>
          <p><strong>Region: </strong>{props.game.region}</p>
          <p><strong>Status: </strong>{(props.game.status === "finished") ? "Finished" : "Upcoming"}</p>
          {props.game.winner !== "TBD" && <p><strong>Winner: </strong>{props.game.winner}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={props.onBet}>
            Open Bet
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default GameModal;