import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/LOGO.png'
//import './App.css';
import './betthebracket-auth.css';

//Provides a basic login form for the walking skeleton
function Login() {
    // State variables dynamically re-render the page when they are updated
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    //url for api call
    const url = '/api/betthebracket/authentication/login';

    const handleLogin = async (e) => {
        //stop automatic reload of the page
        e.preventDefault();

        //send credentials to the database for verification
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            // if response is ok, store token in local storage for future reference
            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('token', data.token);
                //localStorage.setItem('userID', data.userID);

                navigate('home');
            }
            
            else {
                navigate('home'); //TODO: delete this bypasses
                //alert("Login failed. Check your credentials and try again!");
            }

        } catch (error) {
            console.error("Error during log in: ", error);
            alert(":( Error during login. Try again later!")
        }
        
    };

    //TODO: Fix logo sizing
    return (
        <div className="auth-page">
            <div className="auth-card">
                <img src={logo} alt="Project team logo"/>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Submit</button>
                </form>
                <div>
                    <hr/>
                    <p>Don't have an account?</p>
                    <button onClick={() => navigate("signup")}>Sign Up Here!</button>
                </div>
            </div>
        </div>
    );
}

export default Login;