import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './ProjectsPage.css'

function ProjectsPage() {
    const btb_features = [
        "Live Odds & Scores", "Secure Auth", "User Stats", "External API Integration", "Auto Payout", "Scrum"
    ]
    const btb_tools = [
        "Java", "SpringBoot", "JavaScript", "React", "Bootstrap", "Docker", "Vite", "MySQL", "RESTful API"
    ]
    const movie_features = [
        "Pagination", "External API Integration", "Modal", ""
    ]
    const movie_tools = [
        "Java", "SpringBoot", "JavaScript", "React", "Docker", "PSQL", "RESTful API", 
    ]
    const navigate = useNavigate();
    return( 
        <>
            <div className='project-page-background'/>

            <div className='page-content'>
            <header className='projects-page-title'>PROJECTS
                <img src='/back-button.png' onClick={() => navigate('/')}></img>

            </header>

            <div className='projects-wrapper'>

                {/* Bet the bracket */}
                <div className='bet-the-bracket-project-container'>
                    <div className='project-image'>
                        <img src='/BTBBracketPage.png'></img>
                    </div>
                        <h2 className='project-name'>Bet the Bracket
                            <hr style={{width: '75%', margin: '0 auto'}}></hr>
                        </h2>
                        <p className='description-text'>
                            Betting platform for NCAA and NBA basketball games. Also features a March Madness bracket and slot machine. Developed as a team in a semester long scrum setting. 
                        </p>
                        <div className='feature-list'>
                            {btb_features.map((feature, index) => (
                                <div className='feature'>{feature}</div>
                                )
                            )}
                        </div>
                        <div className='tool-list'>
                            {btb_tools.map((tool, index) => (
                                <div className='tool'>{tool}</div>
                            ))}
                        </div>
                        <div className='visit-site' onClick={() => navigate('/betthebracket/login')}>
                            <img className='link-image' src='/link-icon.png'></img>
                            <p className='visit-site-text'>Visit Site</p>
                        </div>
                </div>

                {/* Movies */}
                <div className='bet-the-bracket-project-container'>
                    <div className='project-image'>
                        <img src='/MoviePage.png'></img>
                    </div>
                        <h2 className='project-name'>Movie Recs Website
                            <hr style={{width: '75%', margin: '0 auto'}}></hr>
                        </h2>
                        <p className='description-text'>
                            Web app containing all the movies I've watched and rated. Users can sort by genre and rating to find movies that appeal to them. Incorporates external APIs for movie information. 
                        </p>
                        <div className='feature-list'>
                            {movie_features.map((feature, index) => (
                                <div className='feature'>{feature}</div>
                                )
                            )}
                        </div>
                        <div className='tool-list'>
                            {movie_tools.map((tool, index) => (
                                <div className='tool'>{tool}</div>
                            ))}
                        </div>
                        <div className='visit-site' onClick={() => navigate('/movies')}>
                            <img className='link-image' src='/link-icon.png'></img>
                            <p className='visit-site-text'>Visit Site</p>
                        </div>
                </div>



                </div>
            </div>
        </>
    )
}

export default ProjectsPage