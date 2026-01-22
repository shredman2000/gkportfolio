import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import Games from './Games'
import Profile from './Profile';
import NbaGames from './NbaGames';

//Renders the application and sets up routing between pages
function BetTheBracketRoutes() {
    return (
            <Routes>
                <Route path="" element={<Login />} />
                <Route path="home" element={<Home />} />
                <Route path="signup" element={<Signup />} />
                <Route path="games" element={<Games />} />
                <Route path="profile" element={<Profile />} />
                <Route path="nbagames" element={<NbaGames/>} />
            </Routes>
    )
}


export default BetTheBracketRoutes;