import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './MovieHomePage.css'
function MovieHomePage() {
    const navigate = useNavigate();
    const [clues, setClues] = useState([])
    const todayStr = new Date().toISOString().slice(0, 10);
    const [gameDate, setGameDate] = useState(todayStr);
    const today = new Date().toISOString().slice(0, 10);
    const [game, setGame] = useState(null)
    const [gameId, setGameId] = useState(null);

    const [selectedTiles, setSelectedTiles] = useState([])
    const [solvedMovies, setSolvedMovies] = useState([]);
    const [guesses, setGuesses] = useState(0);
    const [adminLoggingIn, setAdminLoggingIn] = useState(false);
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    
    function getColorDifficulty(index) {
        if (index === 0) return "rgba(0, 220, 0, 0.18)";
        else if (index === 1) return "rgba(212, 219, 0, 0.33)";
        else if (index === 2) return "rgba(219, 0, 0, 0.4)";
        else return "rgba(120, 0, 156, 0.4)";
    }
    async function getGame(id) {
        setGameId(id);
        try {
            const response = await fetch('/api/movieconnections/getGame', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({gameId: id })
            });
            const data = await response.json();
            console.log("retrieved data: ", data);
            setGame(data);
            if (gameId === null) {
                setGameId(data.gameId);  
            }
            
        } catch (err) {
            console.error("Error retrieving game: ", err)
        }
    }

    function updateClues(game) {
        if (!game) { 
            return Array(16).fill({url: "", movieIndex: null, id: null })
        }
        const newClues = [];
        //populate new clues and tag the clues with movie index and id 
        game.movies.forEach((movie, movieIndex) => {
            movie.clues.forEach((clue, clueIndex) => {
                newClues.push({
                    url: clue.url,
                    movieIndex,
                    id: `${movieIndex}-${clueIndex}`,
                    color: `${getColorDifficulty(movieIndex)}`
                });
            })
        })

        // shuffle clues
        for (let i = newClues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newClues[i], newClues[j]] = [newClues[j], newClues[i]]
        }
        console.log("new clues: ", newClues);
        return newClues;
    
    }
    function handleTileClick(index) {
        setSelectedTiles(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index); // remove if tile is already selected
            }
            else if (prev.length === 4) {
                return [...prev];
            }
            else {
                return [...prev, index];
            }
        })
    }

    function handleSubmit() {
        if (selectedTiles.length !== 4) {
            return;
        }
        setGuesses(prev => prev + 1);
        // get the actual clues from the tiles
        const selectedClues = selectedTiles.map(i => clues[i]);


        // first we check how many matches there were per movie, and return the best match,
        // for example if the user got 2 clues right for a movie we would tell me that 2 of the 4 were correct
        const matchCounts = game.movies.map((movie, movieIndex) => {
            const count = selectedClues.filter(c => c.movieIndex === movieIndex).length;
            return {title: movie.title, count, movieIndex}
        })

        console.log("Match counts: ", matchCounts);
        // check if they got all 4 right for a movie
        const allCorrectMovie = matchCounts.find(m => m.count === 4);

        // handle moving tiles to top row and revealing the movie name.
        if (allCorrectMovie) {
            const movieIndex = allCorrectMovie.movieIndex;

            if (!solvedMovies.some(m => m.movieIndex === movieIndex)) { // avoids duplicates but not sure whether this is necessary
                const newSolvedMovies = [...solvedMovies, { movieIndex, title: allCorrectMovie.title, color: getColorDifficulty(movieIndex) }];
                setSolvedMovies(newSolvedMovies);

                setClues(prevClues => {
                    const solvedClues = []
                    const remainingClues = []

                    prevClues.forEach(c => {
                        if (newSolvedMovies.map(m => m.movieIndex).includes(c.movieIndex)) {
                            solvedClues.push(c);
                        }
                        else {
                            remainingClues.push(c);
                        }
                    })
                    return [...solvedClues, ...remainingClues]
                })
            }
            setSelectedTiles([])
        }
        else {
            const bestMatch = matchCounts.reduce((prev, curr) => (curr.count > prev.count ? curr : prev))
            alert(`Clues matched a movie: ${bestMatch.count}`);
        }
    }

    function changeDate(offset) {
        const curr = new Date(gameDate);
        curr.setDate(curr.getDate() + offset);

        const newDateString = curr.toISOString().slice(0,10);

        setGameDate(newDateString)

        setSolvedMovies([]);
        setSelectedTiles([])
        setGuesses(0);
    }

    async function handleAdminLogin() {
        
        try {
            const response = await fetch('/api/movieconnections/adminSignIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: adminUsername, password: adminPassword})
            })
            const data = await response.json();

            if (response.ok && data === true) {
                console.log("admin login successful");
                setAdminLoggingIn(false);
                navigate('/admin');
            }
            else {
                console.log("Invalid login");
                alert("Invalid username or password");
            }
        } catch (err) {
            console.error("Login error: ", err)
        }
    }

    useEffect(() => {
        if (gameId === null) {
            getGame(null);
        }
        console.log(gameId)
    }, [])
    useEffect(() => {
        setClues(updateClues(game));
    }, [game])



    return (
        <>
        <div className='main-page-wrapper'>
            <div className='content-wrapper'>
                <div className='header-wrapper'>
                    <div className='previous-day-button' onClick={() => gameId && getGame(gameId - 1)}>Previous Puzzle</div>
                    <h1 className='main-page-title'>Movie Connections</h1>
                    <div className='previous-day-button' onClick={() => gameId && getGame(gameId + 1)}>Next Puzzle</div>

                </div>
                <div className='board-container'>
                    {solvedMovies.map((movie, i) => {
                    const rowCount = 4; // total rows
                    const rowHeight = 100 / rowCount; // percentage height per row

                    return (
                        <div
                        key={movie.movieIndex}
                        className='solved-movie-overlay'
                        style={{
                            top: `${i * rowHeight}%`,
                            height: `${rowHeight}%`,
                            left: 0,
                            right: 0,
                            position: 'absolute',
                            backgroundColor: movie.color
                        }}
                        >
                        {movie.title}
                        </div>
                    )
                    })}
                    {clues.map((clue, index) => (
                        <div key={index} className={`clue-tile ${selectedTiles.includes(index) ? 'selected' : ''}`} onClick={() => handleTileClick(index)}>
                            <img src={clue.url} alt={`clue ${index + 1}`}/>
                        </div>
                    ))}
                </div>
                <button className='submit-button' onClick={() => handleSubmit()}>Submit</button>
                <div className='guesses-div'>
                    <progress id="guess-progress" value={guesses} max="8"></progress>
                </div>
            </div>
            
            <button className='admin-button' onClick={() => setAdminLoggingIn(true)}>Admin</button>
        </div>

        {adminLoggingIn && (
            <div className='admin-modal-backdrop' onClick={() => setAdminLoggingIn(false)}>
                <div className='admin-login-modal' onClick={(e) => e.stopPropagation()}>
                    <p1>Admin Login</p1>
                    <input type='text' className='admin-login-input' placeholder='username' value={adminUsername} onChange={(val) => setAdminUsername(val.target.value)}></input>
                    <input type='text' className='admin-login-input' placeholder='password' value={adminPassword} onChange={(val) => setAdminPassword(val.target.value)}></input>
                    <button className='submit-login-button' onClick={() => handleAdminLogin()}>Submit</button>
                </div>
            </div>
        )}
        </>
    )
}

export default MovieHomePage;