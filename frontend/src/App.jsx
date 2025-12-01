import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Intro from './Intro.jsx'
import HomePage from './HomePage.jsx'
import TypeTestPage from './TypeTestPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/typetest" element={<TypeTestPage />} />
      </Routes>
    </Router>
  )
}
export default App;