import { useState } from "react"
import { Button, Card, Modal } from "react-bootstrap"
import NBAGameModal from "./NBAGameModal"

export default function NBAGameCard(props) {

    return (
        <>
            <Card 
            onClick={props.onClick} 
            style={{ margin: "auto", marginTop: "1rem", maxWidth: "40rem", cursor: "pointer" }}
            >
                <Card.Body>
                    <Card.Title><strong>{props.awayTeam + " @ " + props.homeTeam}</strong></Card.Title>
                    <hr />
                    <Card.Text><strong>Date:</strong> {props.date}</Card.Text>
                    <Card.Text><strong>Time:</strong> {props.time}</Card.Text>
                    <Card.Text><strong>{props.homeTeam + " Odds: "}</strong>{props.homeOdds}</Card.Text>
                    <Card.Text><strong>{props.awayTeam + " Odds: "}</strong>{props.awayOdds}</Card.Text>
                    <Card.Text><strong>Score:</strong> {props.awayTeam} {props.awayScore} – {props.homeTeam} {props.homeScore}</Card.Text>
                    <Card.Text><strong>Status:</strong> {props.status}</Card.Text>
                    {props.status === "finished" && (
                        <Card.Text><strong>Winner:</strong> {props.winner}</Card.Text>
                    )}
                </Card.Body>
            </Card>
        </>
    );
}
