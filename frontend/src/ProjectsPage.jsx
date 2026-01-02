import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './ProjectsPage.css'

function ProjectsPage() {

    const navigate = useNavigate();
    return( 
        <>
            <p>Projects</p>
            <div className="typing-logo">
                <img src="/TypingLogo.svg" draggable="false" onClick={() => navigate('/typetest')}></img>
            </div> 
        </>
    )
}

export default ProjectsPage