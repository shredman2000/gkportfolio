import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './ProjectsPage.css'
import ProjectComponent from './components/ProjectComponent';

function ProjectsPage() {
    const btb_features = [
        "Live Odds & Scores", "Secure Auth", "User Stats", "External API Integration", "Auto Payout", "Scrum"
    ]
    const btb_tools = [
        "Java", "SpringBoot", "JavaScript", "React", "Bootstrap", "Docker", "Vite", "MySQL", "RESTful API"
    ]
    const movie_features = [
        "Pagination", "External API Integration", "Modal",
    ]
    const movie_tools = [
        "Java", "SpringBoot", "JavaScript", "React", "Docker", "PSQL", "RESTful API", "CSS", 
    ]
    const monopoly_features = [
        "Multiplayer", "ML Bots", "Low-Latency", "Real-Time Game State"
    ]
    const monopoly_tools = [
        "WebSockets", "MySQL", "Java", "SpringBoot", "Docker", "Three.js", "JavaScript", "React", "PyTorch", "TensorFlow"
    ]
    const typing_features = [
        "Leaderboard", "Rank"
    ]
    const typing_tools = [
        "JavaScript", "RESTful API", "Java", "CSS", "SQL"
    ]
    const navigate = useNavigate();
    return( 
        <>
            <div className='project-page-background'>

                <div className='page-content'>
                    <span className='back-button-text' onClick={() => navigate('/')}>Back</span>



                    <div className='projects-wrapper'>

                        <ProjectComponent
                            image={'/BTBBracketPage.png'}
                            title={'Bet the Bracket'}
                            description={'Betting platform for NCAA and NBA basketball games. Also features a March Madness bracket and slot machine. Developed as a team in a semester long scrum setting. '}            
                            features={btb_features}
                            tools={btb_tools}
                            navLink={'/betthebracket/login'}
                            />
                        <ProjectComponent 
                            image={'/MoviePage.png'} 
                            title={'Movie Rec Website'} 
                            description={'Web app containing all the movies I`ve watched and rated. Users can sort by genre and rating to find movies that appeal to them. Incorporates external APIs for movie information.'}
                            features={movie_features}
                            tools={movie_tools}
                            navLink={'/movies'}/>

                        <ProjectComponent 
                            image={'/MonopolyHomePage.png'} 
                            title={'Online Monopoly'} 
                            description={'EARLY WIP. Full Monopoly clone for playing with friends or against bots on browser. Planned improvements: Full UI rehaul, expand playable actions, finish training bot model and eventually, ranked play.'}
                            features={monopoly_features}
                            tools={monopoly_tools}
                            navLink={'/movies'}/>
                        <ProjectComponent 
                            image={'/MonopolyHomePage.png'} 
                            title={'Typing Test'} 
                            description={'Simple website for measuring typing speed.'}
                            features={monopoly_features}
                            tools={monopoly_tools}
                            navLink={'/movies'}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectsPage