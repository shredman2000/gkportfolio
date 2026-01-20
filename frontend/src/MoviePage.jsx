import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import './MoviePage.css'
import MovieSelect from './components/SelectComponent';
import BarComponent from './components/BarComponent';
import PageComponent from './components/PageComponent';
import MovieModal from './components/MovieModal';
import SortBySelectComponent from './components/SortBySelectComponent';



function MoviePage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [favoriteLoading, setFavoriteLoading] = useState(true);
    const [recentlyLoading, setRecentlyLoading] = useState(true);
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
    const [seed] = useState(Date.now());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModalMovie, setSelectedModalMovie] = useState(null);
    const [selectedSortMethod, setSelectedSortMethod] = useState(null);
    const [sortingUp, setSortingUp] = useState(false);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    }, [selectedGenre, minRating, gunnarsMinRating, selectedSortMethod, sortingUp]);

    const fetchMovies = async (page = 1) => {
        const minDelay = delay(1000);
        try {
            const response = await fetch('/api/movies/searchmovies', {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    page,
                    limit: 33,
                    genre: selectedGenre?.value ?? null,
                    minRating: minRating,
                    gunnarsMinRating: gunnarsMinRating,
                    seed,
                    selectedSortMethod: selectedSortMethod?.value ?? null,
                    sortingUp,
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
        finally {
            await minDelay;
            setFetchLoading(false);

        }
    }

    const fetchRecentlyWatched = async () => {
        const minDelay = delay(1000);
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
        finally {
            await minDelay;
            setRecentlyLoading(false);
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

    const shuffleCardsLeft = (items, setIndex, setVisible) => {
        setIndex(prevIndex => {
            const nextIndex = prevIndex - 1;
            if (nextIndex >= 0) {
                setVisible(items.slice(nextIndex, nextIndex + numberVisible));
                return nextIndex;
            }
            return prevIndex;
        });
    };

    const fetchFavoriteMovies = async () => {
        const minDelay = delay(1000);
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
        finally {
            await minDelay;
            setFavoriteLoading(false);
        }
    }



    return (
        <div>
            {fetchLoading && favoriteLoading && recentlyLoading && (
                <div className="loader-overlay">
                    <img className='loading-animation' src={'./LoadingAnimation.gif'} alt="Loading..." />
                </div>
            )}
            <div className="grid">
                <div className='movie-page-title'>
                    <img className='gk-logo' src={'./LogoGK.png'}></img>
                    <h1>Gunnar's Movie Recs</h1>
                </div>

                <div className='recently-watched-text'>Recently Watched...</div>
                <div className="recent-watches-container">
                    <div className='recent-watches-row'>
                        <img className="left-arrow" src={'/rightarrow.png'} onClick={() => shuffleCardsLeft(recentlyWatched, setRecentlyWatchedIndex, setVisibleRecentlyWatched)}/>
                        <div className="recent-watches">
                            {(visibleRecentlyWatched.length > 0 ? visibleRecentlyWatched : placeholderMovies).map(movie => (
                                <div key={movie.id} className="movie-card" onClick={() => {
                                   setIsModalOpen(true);
                                   setSelectedModalMovie(movie);
                                }}>
                                    <img src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>
                                </div> 
                            ))}
                        </div>
                        <img className="right-arrow" src={'/rightarrow.png'} onClick={() => shuffleCardsRight(recentlyWatched, setRecentlyWatchedIndex, setVisibleRecentlyWatched)}/>
                    </div>

                </div>

                <div className='favorite-movies-text'>My Favorites...</div>             
                <div className='favorite-movies-container'>

                    <div className='recent-watches-row'>
                        <img className="left-arrow" src={'/rightarrow.png'} onClick={() => shuffleCardsLeft(favoriteMovies, setFavoriteMoviesIndex, setVisibleFavoriteMovies)}/>
                        <div className='recent-watches'>
                            {(visibleFavoriteMovies.length > 0 ? visibleFavoriteMovies : placeholderMovies).map(movie => (
                                <div key={movie.id} className='movie-card' onClick={() => {
                                   setIsModalOpen(true);
                                   setSelectedModalMovie(movie);
                                }}>
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
                                
                                {/* rename this its the genre dropdown menu */}
                                <MovieSelect 
                                    value={selectedGenre} 
                                    onChange={(option) => {
                                        if(selectedGenre?.value === option?.value) {
                                            setSelectedGenre(null);
                                        }
                                        else {
                                            setSelectedGenre(option);
                                        }
                                    }}
                                /> 
                                
                                <div className='select-button-custom'></div>
                            </div>
                            
                            <div className='slider-wrapper'>
                                <BarComponent className='audience-rating-bar' onChange={setMinRating} value={minRating} title='Minimum Audience Rating'/>
                                <BarComponent className='gunnar-rating-bar' onChange={setGunnarsMinRating} value={gunnarsMinRating} title='Minimum Gunnar Rating'></BarComponent>
                            </div>
                            <div className='sort-by-wrapper'>
                                <SortBySelectComponent value={selectedSortMethod} onChange={(option) => {
                                    if (selectedSortMethod?.value === option?.value) {
                                        setSelectedSortMethod(null);
                                    }
                                    else {
                                        setSelectedSortMethod(option);
                                    }
                                }} ></SortBySelectComponent>
                                <button className='sorting-direction-button' 
                                    onClick={() => setSortingUp(prev => !prev)} 
                                    style={{
                                        backgroundImage: sortingUp ? "url('/UpArrow.png')" : "url('/DownArrow.png')",
                                        width: '30px',
                                        height: '30px',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        padding: 0,
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='movie-search-results-box'>
                    <div className='search-results-grid'>
                        {movies.map(movie => (
                            <div key={movie.id} className="search-result-wrapper" onClick={() => {
                                   setIsModalOpen(true);
                                   setSelectedModalMovie(movie);
                                }}>                                
                                <div className='search-result-card'>
                                    
                                    <img className="search-result-movie-card" src={movie.posterURL || '/MoviePoster.png'} alt={movie.title}/>

                                    <div className='audience-score-wrapper'>
                                        <p className='audience-rating-on-img'>{movie.rating.toFixed(1)}</p>
                                        <img className='audience-score-img' src={'/AudienceScore.png'}></img>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className='page-container'>
                        <PageComponent 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(pageNum) => fetchMovies(pageNum)}
                            maxButtons={2}
                            />
                    </div>
                </div>
                

            

            </div>
            {isModalOpen && selectedModalMovie && (
                    <MovieModal isOpen={isModalOpen} movie={selectedModalMovie} onClose={() => setIsModalOpen(false)}/>
                )
            }
        </div>
        
    );
    

}

export default MoviePage;