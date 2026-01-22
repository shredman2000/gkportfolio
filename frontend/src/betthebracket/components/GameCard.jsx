import { useState } from "react"
import { Button, Card, Modal } from "react-bootstrap"
import GameModal from "./GameModal"

export default function GameCard(props) {

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
                    <Card.Text><strong>Date: </strong>{props.date}</Card.Text>
                </Card.Body>
                :
                <Card.Body>
                    <Card.Title><strong>{props.homeTeam + " vs. " + props.awayTeam}</strong></Card.Title>
                    <hr />
                    <Card.Text>{props.round}</Card.Text>
                    <Card.Text><strong>Date: </strong>{props.date}</Card.Text>
                    <Card.Text><strong>{props.homeTeam + " Odds: "}</strong>{props.homeOdds}</Card.Text>
                    <Card.Text><strong>{props.awayTeam + " Odds: "}</strong>{props.awayOdds}</Card.Text>
                </Card.Body>
                }
            </Card>
        </>
    );
}
