import { useEffect, useState } from "react"
import { Button, Card, Modal } from "react-bootstrap"
import GameModal from "./GameModal"

export default function GameCard(props) {

    const [timeLeft, setTimeLeft] = useState(props.timestamp - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(props.timestamp - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [props.timestamp]);

    const formatTime = (ms) => {
        if (ms <= 0) { return "00:00:00" }
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds/3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2,"0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    }

    return (
        <>
            <Card 
            onClick={props.onClick} 
            style={{ margin: "auto", marginTop: "1rem", maxWidth: "40rem", cursor: "pointer" }}
            >
                {props.tinyCard ? 
                <Card.Body>
                    <Card.Title><strong>{props.homeTeam + " vs. " + props.awayTeam}</strong></Card.Title>
                    <hr />
                    <Card.Text><strong>Date: </strong>{props.displayDate}</Card.Text>
                    <Card.Text><strong>Tip-off in: </strong>{formatTime(timeLeft)}</Card.Text>
                </Card.Body>
                :
                <Card.Body>
                    <Card.Title><strong>{props.homeTeam + " vs. " + props.awayTeam}</strong></Card.Title>
                    <hr />
                    <Card.Text>{props.round}</Card.Text>
                    <Card.Text><strong>Date: </strong>{props.displayDate}</Card.Text>
                    {props.status === "scheduled" && 
                        <Card.Text><strong>Tip-off in: </strong>{formatTime(timeLeft)}</Card.Text>
                    }
                    <Card.Text><strong>{props.homeTeam + " Odds: "}</strong>{props.homeOdds}</Card.Text>
                    <Card.Text><strong>{props.awayTeam + " Odds: "}</strong>{props.awayOdds}</Card.Text>
                </Card.Body>
                }
            </Card>
        </>
    );
}
