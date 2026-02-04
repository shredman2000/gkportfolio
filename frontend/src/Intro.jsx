import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import './Intro.css'

const name_letters = [
  "G", "U", "N", "N" , "A", "R", " ", "K", "N", "O", "X"
]
const obfuscate_symbols = [
  "A", "E", "F", "H", "K", "M", "N", "T", "V", "X", "Z",
  "0", "2", "3", "4", "5", "7", "8",
  "=", "+", "-", "_",
  "#", "@"
];

function ObsfucatingLetter({ letter, index }) {
  const [display, setDisplay] = useState("");
  const intervalRef = useRef(null);
  const [hoverLock, setHoverLock] = useState(true);

  const runAnimation = (continous = false) => {

    if (letter === " ") return;

    if (!continous) {setHoverLock(true)}

    if (intervalRef.current) { clearInterval(intervalRef.current) }

    let step = 0;
    const totalSteps = 15;
    const intervalTime = 40;

      intervalRef.current = setInterval(() => {
    
        let nextDisplay;

        if (step >= totalSteps) {
          if (continous) {
            step = 0;
          }
          else {
            setDisplay(letter);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        else {
          const randomIndex = Math.floor(Math.random() * obfuscate_symbols.length);
          nextDisplay = obfuscate_symbols[randomIndex];
          setDisplay(nextDisplay);
          setHoverLock(false)
        }
        
        step++;
      }, intervalTime);
  }
  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplay(letter);
    }
  }

  useEffect(() => {
    const delay = index * 200;
    const timeout = setTimeout(() => runAnimation(), delay)

    return () => clearTimeout(timeout);
  }, [letter, index]);

    return (
    <div 
      className="letter-span"
      onMouseEnter={() => {hoverLock ? "" : runAnimation(true)}} 
      onMouseLeave={stopAnimation}
    >
      {display}
    </div>
  );
}


function Intro() {
  const navigate = useNavigate();


  return (
    <>
      <div className='intro-page-wrapper intro-page-background'>
        <header className='intro-page-header'>
          <h5 className='header-text'>Full Stack Developer</h5>
        </header>
        <div className='intro-nav-container'>
          <h3 className='intro-nav-text'>About Me</h3>
          <h3 className='intro-nav-text' onClick={() => navigate('/home')}>Projects</h3>
          <h3 className='intro-nav-text'>Contact</h3>
        </div>
        <h2 className='hi-im-text'>Hi! I'm...</h2>
        <div className='large-name-container'>
          <div className='large-name-wrapper'>
            {name_letters.map((letter, index) => (
              <ObsfucatingLetter index={index} letter={letter}/>
            ))}
          </div>
        </div>
        <div className='interests-text-wrapper'>
          <div className='interests-text-1'>I'm currently learning and growing as a web developer,</div>
          <div className='interests-text-2'>focused on turning small projects into learning opportunities. </div>
        </div>
        <div className='faceshot-div'>
          <img src='./public/Me.png'/>
        </div>
        <div className='links-div'>
          <img src='/linkedinlogo.png'></img>
          <img src='/githublogo.png'></img>
        </div>
      </div>
      
    </>
)}



export default Intro
