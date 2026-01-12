import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import '/MoviePage.css'

function MoviePage() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

    const fetchMovies = async () => {
        try {
            const response = await fetch('https://gunnarknox.com/api/searchMovies', {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ genres: ['war']})
            });
            const data = await response.json();
            setMovies(data.slice(0,10));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div style={{padding: "2rem"}}> 
            <h1>Movies</h1>
            <button onClick={fetchMovies}>Movies war movies for now</button>
            
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id} style={{marginBottom: '1rem'}}>
                        <img 
                            src={movie.posterURL}
                            alt={movie.title}
                            style={{width: '100px', marginRight: '1rem', verticalAlign: 'middle'}}
                        />
                        <strong>{movie.title}</strong> ({movie.year})
                    </li>
                ))}
            </ul>
        </div>
    )


}

export default MoviePage;