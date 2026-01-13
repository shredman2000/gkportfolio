import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './MoviePage.css'

function MoviePage() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

    const fetchMovies = async () => {
        try {
            const response = await fetch('https://gunnarknox.com/api/movies/searchMovies', {
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

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Movies</h1>
            <button onClick={fetchMovies}>Movies war placeholder</button>

            <div className="movie-grid">
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
    );


}

export default MoviePage;