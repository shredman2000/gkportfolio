import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import './IntroModal.css';
import AboutMe from './AboutMe';

function IntroModal({isOpen, origin, type, onClose}) {
    if (!isOpen || !origin) { return null; }
    const [animationDone, setAnimationDone] = useState(false)

    const width = window.innerWidth / 8 * 6;
    const height = window.innerHeight / 8 * 6;

    const [currentStep, setCurrentStep] = useState(0);

    const topLeft = { x: 0, y: 0 };
    const topRight = { x: width, y: 0 };
    const bottomLeft = { x: 0, y: height };
    const bottomRight = { x: width, y: height };
    const origin_x = origin.x;
    const origin_y = origin.y;


    function AnimatedLine({ start, end,  duration = 500, animate=true, onFinish, forceEnd = false }) {
        const hasAnimatedRef = useRef(false);
        const [currentEnd, setCurrentEnd] = useState({x: start.x, y: start.y})
        const startTimeRef = useRef(null);

        useEffect(() => {
            if (!animate || hasAnimatedRef.current) return;
            hasAnimatedRef.current = true;
            let animationFrameId;

            if (forceEnd) {
                setCurrentEnd(end);  // immediately set to final position
                return;
            }
            function animate(timestamp) {
                if (!startTimeRef.current) { startTimeRef.current = timestamp}
                const elapsed = timestamp - startTimeRef.current;

                const progress = Math.min(elapsed / duration, 1)

                const target = end;

                setCurrentEnd({
                    x: start.x + (target.x - start.x) * progress,
                    y: start.y + (target.y - start.y) * progress
                });
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
                else {
                    if (onFinish) { onFinish(); }
                }
            }
            animationFrameId = requestAnimationFrame(animate);

            
            return () => cancelAnimationFrame(animationFrameId);
        }, [animate, start, end, duration, onFinish]);

        return (
            <line x1={start.x} y1={start.y} x2={currentEnd.x} y2={currentEnd.y} stroke='white' strokeWidth={2}/>
        )
    }

    function OrderHandler({origin, topLeft, bottomLeft, topRight, bottomRight, currentStep, setCurrentStep}) {
        const lines = [
            {start: topLeft, end: bottomLeft},
            {start: bottomLeft, end: bottomRight},
            {start: bottomRight, end: topRight},
            {start: topRight, end: topLeft},
        ]

        return (
            <>
                {lines.map((line, index) => (
                    <AnimatedLine
                        key={index}
                        start={line.start}
                        end={line.end}
                        duration={500}
                        animate={index === currentStep}  
                        onFinish={() => {
                            if (index === lines.length -1) {
                                setAnimationDone(true);
                            }
                            setCurrentStep(prev => prev + 1)}  
                        } 
                        forceEnd={index < currentStep}
                    />
                ))}
            </>
        );
    }


    return (
        <div className='intro-modal-wrapper'  onClick={onClose}>
            <div className='intro-modal-container' style={{width, height, top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} onClick={(e) => e.stopPropagation()}>

                <svg width={width} height={height} style={{zIndex: '10000'}}>
                    <OrderHandler
                        origin={origin}
                        topLeft={topLeft}
                        bottomLeft={bottomLeft}
                        topRight={topRight}
                        bottomRight={bottomRight}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                    />
                </svg>

                {animationDone && (type === "about") &&(
                    <div className="intro-modal-content">
                        <AboutMe></AboutMe>

                    </div>
                )}
            </div>
        </div>
    )
}
export default IntroModal;