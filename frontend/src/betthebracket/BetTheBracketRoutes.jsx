import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import Games from './Games'
import Profile from './Profile';
import NbaGames from './NbaGames';
import Slot from './Slot';

//Renders the application and sets up routing between pages
function BetTheBracketRoutes() {

    const [token, setToken] = useState(localStorage.getItem('token'));



    return (
            <Routes>
                <Route path="login" element={token ? <Navigate to="/betthebracket/home" replace /> : <Login setToken={setToken}/>} />
                <Route path="home" element={token ? <Home /> : <Login setToken={setToken}/>} />
                <Route path="signup" element={token ? <Home /> : <Signup/>} />
                <Route path="games" element={token ? <Games /> : <Login setToken={setToken}/>} />
                <Route path="profile" element={token ? <Profile /> : <Login setToken={setToken}/>} />
                <Route path="nbagames" element={token ? <NbaGames/> : <Login setToken={setToken}/> } />
                <Route path="slot" element={token ? <Slot/> : <Login setToken={setToken}/>} />
            </Routes>
    )
}


export default BetTheBracketRoutes;