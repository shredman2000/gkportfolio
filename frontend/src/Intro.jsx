import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './Intro.css'

function Intro() {
  const navigate = useNavigate();

  return (
    <>
      <div className='intro-title'>
        <p id="name">Gunnar Knox</p>
        <button id="view-portfolio-button" onClick={() => navigate('/home')}>Visit Portfolio</button>
      </div>
    </>
)}



export default Intro
