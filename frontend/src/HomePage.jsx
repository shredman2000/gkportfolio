import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './HomePage.css';

function HomePage() {

    const navigate = useNavigate();


    return (
        <div className='home-page'>
            <div className='board-container'>
                <div className='season-pass-sticker-wrapper'>
                    <img src='/SeasonPass.png' className='season-pass-sticker' onClick={() => navigate()}></img>
                </div>
            </div>
            <div className='content'>
                <p>HomePage</p>
                {/* <button className='navigate-projects-button' onClick={() => navigate('/projects')}>Projects</button> */}
                <button className='navigate-movie-page-button' onClick={() => navigate('/movies')}>Movies</button>
            </div>
        </div>

    )
}

export default HomePage;