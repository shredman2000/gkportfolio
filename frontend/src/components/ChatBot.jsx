import { useState, useEffect, useRef } from 'react'
import './ChatBot.css';

export default function ChatBot(props) {
    const [chathistory, setChatHistory] = useState([
        {sender: "bot", message: "Ask me a question!"},
        {sender: "user", message: "What is your favorite color and where did you go to school?"},
        {sender: "bot", message: "My favorite color is blue and I attended University of Wisconsin-Madison"},
        {sender: "user", message: "Tell me about yourself."},
        {sender: "bot", message: "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"}
    ]);


    return (
        <div className="chat-bot-container">
            {!props.chatbotopen && (
                <div>
                    <button className="chat-bot-closed-button" onClick={props.openChat}>Chat</button>
                </div>
            )}

            {props.chatbotopen && (
                <div className='chat-bot-open'>
                    <div className='chat-container'>
                        {chathistory.map((item, index) => (
                            <div key={index} className={`${item.sender}`}>
                                {item.message}
                            </div>
                        ))}
                    
                    </div>
                    <div className='input-container'> 

                    </div>
                </div>
            )}       
        
        </div>
    )
}