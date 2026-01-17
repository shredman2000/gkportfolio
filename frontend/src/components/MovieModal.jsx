import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import './MovieModal.css'

const MovieModal = ({isOpen, onClose, movie}) => {
    const [flipped, setFlipped] = useState(false);
    if (!isOpen) return null;

    useEffect(() => {
        if (isOpen) {
        setFlipped(false); // reset when modal opens
        const timer = setTimeout(() => setFlipped(true), 300); // flip after 0.5s
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
                    <div className='card-back-wrapper'>
                        <h2 className='movie-title'>{movie.title}</h2>
                        <img className="movie-backdrop" src={movie.backdropURL}></img>
                        <div className='audience-rating-wrapper'>
                            <img src={'./AudienceScore.png'} className='audience-rating-img'></img>
                            <p className='audience-rating-text'>{movie.rating.toFixed(1)}</p>
                        </div>
                        <p className='year'>{movie.year}</p>
                        <div className='genre-wrapper'>
                            {movie.genres.map((genre) => (
                                <span key={genre} className='genre'> {genre}</span>
                            ))}
                        </div>
                        <div className='synopsis-wrapper'>
                            <div className='synopsis'>
                                {movie.synopsis}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default MovieModal;