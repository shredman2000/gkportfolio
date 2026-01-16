import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import './MovieModal.css'

const MovieModal = ({isOpen, onClose, movie}) => {
    const [flipped, setFlipped] = useState(false);
    if (!isOpen) return null;

    useEffect(() => {
        if (isOpen) {
        setFlipped(false); // reset when modal opens
        const timer = setTimeout(() => setFlipped(true), 500); // flip after 0.5s
        return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return createPortal(
        <div className='modal-background' onClick={onClose}>
            <div className={`modal-card ${flipped ? 'flipped' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/*poster side*/}
                <div className='card-face card-front'>
                    <img src={movie.posterURL}></img>
                </div>
                {/*info side*/}
                <div className='card-face card-back'>
                    <h2 className='movie-title'>{movie.title}</h2>
                    <p>Year: {movie.year}</p>
                    <p>Gunnar Rating: {movie.gunnarsRating}</p>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default MovieModal;