import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './MoviePage.css'



function MoviePage() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [recentlyWatched, setRecentlyWatched] = useState([]);
    const [visibleRecentlyWatched, setVisibleRecentlyWatched] = useState([]);
    const [recentlyWatchedIndex, setRecentlyWatchedIndex] = useState(0);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [visibleFavoriteMovies, setVisibleFavoriteMovies] = useState([]);
    const [favoriteMoviesIndex, setFavoriteMoviesIndex] = useState(0);
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
        fetchFavoriteMovies();
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
            setVisibleRecentlyWatched(result.results.slice(recentlyWatchedIndex, numberVisible));
        } catch (e) {
            console.error(e);
        }
    }
    const shuffleCardsRight = () => {

        const nextIndex = recentlyWatchedIndex + 1;
        if (nextIndex <= recentlyWatched.length - numberVisible) {
            setRecentlyWatchedIndex(nextIndex);
            const newFive = recentlyWatched.slice(nextIndex, nextIndex + numberVisible);
            setVisibleRecentlyWatched(newFive);
        }
    }

    const fetchFavoriteMovies = async () => {
        try {
            const response = await fetch('/api/movies/favoritemovies', {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error(`Error status: ${response.status}`)
            }
            const result = await response.json();
            setFavoriteMovies(response.results || []);
            setVisibleFavoriteMovies(result.results.slice(favoriteMoviesIndex, numberVisible))
        } catch (e) {
            console.error(e)
        }
    }



    return (
        <div>
            
            <div className="grid">
                <div className='movie-page-title'>
                    <h1>Gunnar's Movie Recs</h1>
                </div>

                <div className="recent-watches-container">
                    <h1 className='normal-text'>I Recently Watched...</h1>
                    <div className='recent-watches-row'>
                        <div className="recent-watches">
                            {(visibleRecentlyWatched.length > 0 ? visibleRecentlyWatched : placeholderMovies).map(movie => (
                                <div key={movie.id} className="movie-card">
                                    <img src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>
                                    
                                </div>
                                
                            ))}
                            
                        </div>
                        <img className="right-arrow" src={'/rightarrow.png'} onClick={shuffleCardsRight}/>
                    </div>
                    <p className="recently-watched-text">Recently watched</p>
                </div>
                <div className='favorite-movies-container'>
                        <h1 className='normal-text'>My Favorites...</h1>
                        <div className='recent-watches-row'>
                            <div className='recent-watches'>
                                {(visibleFavoriteMovies > 0 ? visibleFavoriteMovies : placeholderMovies).map(movie => (
                                    <div key={movie.id} className='movie-card'>
                                        <img src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>
                                    </div>
                                ))}

                            </div>
                        </div>

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