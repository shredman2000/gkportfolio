import { useState, useEffect, useRef } from 'react'
import './ChatBot.css';

export default function ChatBot(props) {
    const chatContainerRef = useRef(null);
    const [input, setInput] = useState('');
    const [chathistory, setChatHistory] = useState([
        {sender: "bot", message: "Ask me a question!"},
        {sender: "user", message: "What is your favorite color and where did you go to school?"},
        {sender: "bot", message: "My favorite color is blue and I attended University of Wisconsin-Madison"},
        {sender: "user", message: "Tell me about yourself."},
        {sender: "bot", message: "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"}
    ]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chathistory])


    // add message to chat history, and submit to agent backend, then retrieve the agents response and add that to chat history.
    function handleSubmit() {
        setChatHistory(prev => [
            ...prev,
            {sender: 'user', message: input }
        ]);

        // fetch from backend




        // cleanup
        setInput('');

    }

    return (
        <div className="chat-bot-container">
            {!props.chatbotopen && (
                <div>
                    <button className="chat-bot-closed-button" onClick={props.openChat}>Chat</button>
                </div>
            )}

            {props.chatbotopen && (
                <div className='chat-bot-open'>
                    <div className='chat-container' ref={chatContainerRef}>
                        {chathistory.map((item, index) => (
                            <div key={index} className={`${item.sender}`}>
                                {item.message}
                            </div>
                        ))}
                    
                    </div>
                    <div className='input-container'> 
                        <input 
                            type='text' 
                            className='chat-input' 
                            value={input} 
                            placeholder='Ask away!' 
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                        ></input>
                    </div>
                </div>
            )}       
        
        </div>
    )
}