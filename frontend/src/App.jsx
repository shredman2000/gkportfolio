import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Intro from './Intro.jsx'
import ProjectsPage from './ProjectsPage.jsx'
import TypeTestPage from './TypeTestPage.jsx'
import HomePage from './HomePage.jsx'
import MoviePage from './MoviePage.jsx';
import BetTheBracketRoutes from './betthebracket/BetTheBracketRoutes.jsx';
import BetTheBracketLayout from './betthebracket/BetTheBracketLayout.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/typetest" element={<TypeTestPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/movies" element={<MoviePage/>} />
        <Route path="/betthebracket/*" element={ 
          <BetTheBracketLayout>
            <BetTheBracketRoutes/>
          </BetTheBracketLayout>}
        />
      </Routes>
    </Router>
  )
}
export default App;