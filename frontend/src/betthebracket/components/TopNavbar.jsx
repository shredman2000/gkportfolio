import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/LOGO.png'
import './TopNavbar.css'
export default function TopNavbar({ setToken }) {

    const navigate = useNavigate();



    //remove token from local storage and redirect to home page
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate("/betthebracket/login");
        console.log('authtoken: ', localStorage.getItem('token'))
    };


    return (
        <nav className='top-navbar'>
            <div className="navbar-container">
        
                <img src={logo} alt="BetTheBracket Logo" className="betthebracket-logo" onClick={() => navigate('/betthebracket/home')}/>
                

                <div className="nav-links">
                    <button onClick={() => navigate("/betthebracket/games")} className="nav-bar-button">NCAA Games</button>
                    <button onClick={() => navigate("/betthebracket/nbagames")} className="nav-bar-button">NBA</button>
                    <button onClick={() => navigate("/betthebracket/slot")} className="nav-bar-button">Slots</button>
                    <button onClick={() => navigate("/betthebracket/profile")} className="nav-bar-button">Profile</button>
                    
                </div>
                <button onClick={() => {handleLogout()}} className="logout-button">Logout</button>
            </div>
        </nav>
    )}