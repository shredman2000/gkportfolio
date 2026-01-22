import { useEffect } from 'react';
import { Button, Modal } from "react-bootstrap";

function NBAGameModal(props) {
  useEffect(() => {}, [props.showGameModal]);

  const { game } = props;

  const isFinished = game.status === "finished";
  const showScores = isFinished && game.homeScore !== 0 && game.awayScore !== 0;

  return (
    <Modal show={props.showGameModal} onHide={props.onClose} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Game Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>{game.homeTeam}</strong> vs <strong>{game.awayTeam}</strong>
        </p>
        <p><strong>Date: </strong>{game.date}</p>
        <p><strong>Time: </strong>{game.time}</p>
        <p><strong>Status: </strong>{isFinished ? "Finished" : "Upcoming"}</p>
        {showScores && (
          <p>
            <strong>Score: </strong>{game.homeScore} - {game.awayScore}
          </p>
        )}
        {isFinished && game.winner !== "No Winner Yet" && (
          <p><strong>Winner: </strong>{game.winner}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        {!isFinished && (
          <Button variant="primary" onClick={props.onBet}>
            Open Bet
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default NBAGameModal;
