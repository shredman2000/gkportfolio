import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './HomePage.css'

function HomePage() {

    const navigate = useNavigate();
    return( 
        <>
            <p>HomePage</p>
            <div className="typing-logo">
                <img src="/TypingLogo.svg" draggable="false" onClick={() => navigate('/typetest')}></img>
            </div> 
        </>
    )
}

export default HomePage