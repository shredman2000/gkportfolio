import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import './MoviePage2.css'
import MovieSelect from './components/SelectComponent';
import BarComponent from './components/BarComponent';



function MoviePage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [movies, setMovies] = useState([]);
    const [recentlyWatched, setRecentlyWatched] = useState([]);
    const [visibleRecentlyWatched, setVisibleRecentlyWatched] = useState([]);
    const [recentlyWatchedIndex, setRecentlyWatchedIndex] = useState(0);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [visibleFavoriteMovies, setVisibleFavoriteMovies] = useState([]);
    const [favoriteMoviesIndex, setFavoriteMoviesIndex] = useState(0);
    const numberVisible = 6;
    const [minRating, setMinRating] = useState(0);
    const [gunnarsMinRating, setGunnarsMinRating] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState(null);
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

    useEffect(() => {
        fetchMovies(1);
    }, [selectedGenre, minRating, gunnarsMinRating]);

    const fetchMovies = async (page = 1) => { // 1 is initial value
        try {
            const response = await fetch('/api/movies/searchmovies', {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    page,
                    limit: 30,
                    genre: selectedGenre?.value ?? null,
                    minRating: minRating,
                    gunnarsMinRating: gunnarsMinRating
                })
            });
            const data = await response.json();
            console.log(data);

            setMovies(data.results);
            setCurrentPage(page);
            setTotalPages(data.totalPages || 1);
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
    const shuffleCardsRight = (items, setIndex, setVisible) => {

        setIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex <= items.length - numberVisible) {
            setVisible(items.slice(nextIndex, nextIndex + numberVisible));
            return nextIndex;
        }
        return prevIndex;
        });
        
    };

    const fetchFavoriteMovies = async () => {
        try {
            const response = await fetch('/api/movies/favoritemovies', {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error(`Error status: ${response.status}`)
            }
            const result = await response.json();
            setFavoriteMovies(result.results || []);
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

                <div className='recently-watched-text'>Recently Watched...</div>
                <div className="recent-watches-container">
                    <div className='recent-watches-row'>
                        <div className="recent-watches">
                            {(visibleRecentlyWatched.length > 0 ? visibleRecentlyWatched : placeholderMovies).map(movie => (
                                <div key={movie.id} className="movie-card">
                                    <img src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>
                                </div> 
                            ))}
                        </div>
                        <img className="right-arrow" src={'/rightarrow.png'} onClick={() => shuffleCardsRight(recentlyWatched, setRecentlyWatchedIndex, setVisibleRecentlyWatched)}/>
                    </div>

                </div>


                <div className='favorite-movies-container'>

                    <div className='recent-watches-row'>
                        <div className='recent-watches'>
                            {(visibleFavoriteMovies.length > 0 ? visibleFavoriteMovies : placeholderMovies).map(movie => (
                                <div key={movie.id} className='movie-card'>
                                    <img src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>
                                </div>
                            ))}

                        </div>
                        <img className="right-arrow" src={'/rightarrow.png'} onClick={() => shuffleCardsRight(favoriteMovies, setFavoriteMoviesIndex, setVisibleFavoriteMovies)}/>
                    </div>
                </div>


                <div className="search-movies-box">
                    <div className='search-movies-search-box'>
                        <div className='inner-wrapper-search'>
                            <div className='select-wrapper'>
                                <MovieSelect value={selectedGenre} onChange={(option) => setSelectedGenre(option)}/> {/* rename this its the genre dropdown menu */}
                                
                                <div className='select-button-custom'></div>
                            </div>
                            
                            <div className='slider-wrapper'>
                                <BarComponent className='audience-rating-bar' onChange={setMinRating} value={minRating} title='Minimum Audience Rating'/>
                                <BarComponent className='gunnar-rating-bar' onChange={setGunnarsMinRating} value={gunnarsMinRating} title='Minimum Gunnar Rating'></BarComponent>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='movie-search-results-box'>
                    <div className='search-results-grid'>
                        {movies.map(movie => (
                            <div key={movie.id} className='search-result-card'>
                                <img src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>
                            </div>
                        ))}
                    </div>
                </div>



            </div>
        </div>
    );


}

export default MoviePage;