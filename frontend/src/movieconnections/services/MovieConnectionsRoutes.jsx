import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MovieHomePage from '../src/MovieHomePage';
import MovieAdminPage from '../src/MovieAdminPage';

function MovieConnectionsRoutes() {
  return (
    <Routes>
      <Route path="/homepage" element={<MovieHomePage />} />
      <Route path="/admin" element={<MovieAdminPage />} />
      <Route path="" element={<MovieHomePage />}/>
    </Routes>
  )
}
export default MovieConnectionsRoutes;