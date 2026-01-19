import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import './MovieModal.css'

const MovieModal = ({isOpen, onClose, movie}) => {
    const [flipped, setFlipped] = useState(false);
    if (!isOpen) return null;

    const paymentTypeLabel = {
        flatrate: 'Subscription',
        rent: 'Rent',
        buy: 'Buy',
    };

    useEffect(() => {
        if (isOpen) {
        setFlipped(false); // reset when modal opens
        const timer = setTimeout(() => setFlipped(true), 300); // flip after 0.5s
        return () => clearTimeout(timer);
        }
    }, [isOpen]);
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
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
                        <div className='gunnar-rating-wrapper'>
                            <img src={'./LogoNew.png'} className='gunnar-rating-img'></img>
                            <p className='gunnar-rating-text'>{movie.gunnarsRating.toFixed(0)}</p>
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
                        <div className='streaming-wrapper'>
                            {movie.streamingServices.map((service) => (
                                <div key={`${service.streamingService}-${service.paymentType}`} className='streaming-service'>
                                    {paymentTypeLabel[service.paymentType] ?? service.paymentType}: {' '}<a className='service-link' href={service.URL}>{service.streamingService}</a></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default MovieModal;