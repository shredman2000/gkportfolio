import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/LOGO.png'
//import './App.css';
import './betthebracket-auth.css';

//Provides a basic login form for the walking skeleton
function Signup() {
    // State variables dynamically re-render the page when they are updated
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    //TODO: Update url for signup
    const url = '/api/betthebracket/users';

    const handleSignup = async (e) => {
        //stop automatic reload of the page
        e.preventDefault();

        //TODO: add email validation and check against database for existing accounts

        //send credentials to the database for verification and account creation
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            // if response is ok, store token in local storage for future reference
            if (response.ok) {
                const token = await response.json();

                localStorage.setItem('token', token.token);

                navigate('');
            }
            
            else {
                alert("Signup failed. Please log in if you already have an account or try again later!");
            }

        } catch (error) {
            console.error("Error during sign up: ", error);
            alert(":( Error during sign up. Try again later!")
        }
    };

    //TODO: Fix logo sizing
    return (
        <div className="auth-page">
            <div className="auth-card">
                <img src={logo} alt="Project team logo"/>
                <h1>Login</h1>
                <form onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
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
                    <p>Already have an account?</p>
                    <button onClick={() => navigate("")}>Login Here!</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;