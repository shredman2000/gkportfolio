import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './MoviePage.css'



function MoviePage() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [recentlyWatched, setRecentlyWatched] = useState([]);
    const [visibleRecentlyWatched, setVisibleRecentlyWatched] = useState([]);
    const [recentlyWatchedIndex, setRecentlyWatchedIndex] = useState(0);
    const numberVisible = 5;

    const placeholderMovies = [
    { id: 1, title: "Movie 1", year: 2026, gunnarsRating: 5, posterURL: "/MoviePoster.png" },
    { id: 2, title: "Movie 2", year: 2025, gunnarsRating: 4, posterURL: "/MoviePoster.png" },
    { id: 3, title: "Movie 3", year: 2024, gunnarsRating: 3, posterURL: "/MoviePoster.png" },
    { id: 4, title: "Movie 4", year: 2023, gunnarsRating: 4, posterURL: "/MoviePoster.png" },
    { id: 5, title: "Movie 5", year: 2022, gunnarsRating: 5, posterURL: "/MoviePoster.png" },
    ];
    //on mount
    useEffect(() => {
        fetchRecentlyWatched();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch('/api/movies/searchmovies', {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ genres: ['War']})
            });
            const data = await response.json();
            console.log(data);
            setMovies(data.results.slice(0,18));
        } catch (e) {
            console.error(e);
        }
    }

    const fetchRecentlyWatched = async () => {
        try {
            const response = await fetch('/api/movies/recentlywatched', {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error(`Error status: ${response.status}`)
            }
            const result = await response.json();
            setRecentlyWatched(result.results || [])
            setVisibleRecentlyWatched(recentlyWatched.slice(recentlyWatchedIndex, numberVisible));
        } catch (e) {
            console.error(e);
        }
    }
    const shuffleCardsRight = () => {
        if (recentlyWatchedIndex <= recentlyWatched.length - numberVisible) {
            setRecentlyWatchedIndex(prev => prev + 1);
            const newFive = recentlyWatched.slice(recentlyWatchedIndex, recentlyWatchedIndex + numberVisible);
            setVisibleRecentlyWatched(newFive);
        }
    }

    return (
        <div>
            
            <div className="grid">
                <div className='movie-page-title'>
                    <h1>Gunnar's Movie Recs</h1>
                </div>
            
                <div className="recent-watches-container">
                    <div className='recent-watches-row'>
                        <div className="recent-watches">
                            {(recentlyWatched.length > 0 ? recentlyWatched : placeholderMovies).map(movie => (
                                <div key={movie.id} className="movie-card">
                                    <img src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>
                                    
                                </div>
                                
                            ))}
                            
                        </div>
                        <img className="right-arrow" src={'/rightarrow.png'} onClick={shuffleCardsRight}/>
                    </div>
                    <p className="recently-watched-text">Recently watched</p>
                </div>


                <div className="search-movies-box">
                    <button onClick={fetchMovies}>Movies war placeholder</button>
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img 
                                src={movie.posterURL || '/placeholder.png'}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <div className="movie-info">
                                <strong>{movie.title}</strong> ({movie.year})
                                <p>Gunnar's Rating: {movie.gunnarsRating}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );


}

export default MoviePage;