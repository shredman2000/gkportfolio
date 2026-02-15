import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const tech_stack = [
    {name: "Java", logo:  "/JavaLogo.png", level: 90},
    {name: "JavaScript", logo: "/JavaScriptLogo.png", level: 80},
    {name: "HTML", logo: "/HTMLLogo.png", level: 80},
    {name: "CSS", logo: "/CSSLogo.png", level: 70},
    {name: "SQL", logo: "/SQLLogo.png", level: 70},
    {name: "Python", logo: "/PythonLogo.png", level: 60},
    {name: "Kotlin", logo: "/KotlinLogo.png", level: 50},
    {name: "C", logo: "/CLogo.png", level: 40},
    {name: "Assembly", logo: "/AssemblyLogo.png", level: 30}
    
]
const tech_frameworks = [
    {name: "SpringBoot", logo: "/SpringBootLogo.png", level: 90},
    {name: "React", logo: "/ReactLogo.png", level: 80},
    {name: "Three.js", logo: "/ThreeJSLogo.png", level: 70},
    {name: "Pytorch", logo: "/PytorchLogo.png", level: 50},
    {name: "TensorFlow", logo: "/TensorFlowLogo.png", level: 40},
    {name: "JUnit", logo: "/JunitLogo.png", level: 60}
]
const tech_tools = [
    {name: "Git", logo: "/GitLogo.png", level: 90},
    {name: "Docker", logo: "/DockerLogo.png", level: 80},
    {name: "Postman", logo: "/PostManLogo.png", level: 100},
    {name: "Vite", logo: "/ViteLogo.png", level: 70},
    {name: "FireBase", logo: "/FirebaseLogo.png", level: 60},
    {name: "REST API", logo: "/RESTLogo.png", level: 90},
    {name: "WebSocket", logo: "/WebsocketLogo.png", level: 60}
]

const gallery_images = [
    "/GalleryPhoto1.png",
    "/GalleryPhoto2.png",
    "/GalleryPhoto3.png",
    "/GalleryPhoto4.png",
    "/GalleryPhoto5.png",
    "/GalleryPhoto6.png",
    "/GalleryPhoto7.png",
    "/GalleryPhoto8.png",
    "/GalleryPhoto9.png",
    "/GalleryPhoto10.png",
    "/GalleryPhoto11.png",

]

import './AboutMe.css';
function AboutMe() {
    const navigate = useNavigate();
    const [showStack, setShowStack] = useState(tech_stack);
    const [currentImage, setCurrentImage] = useState(0);

    // for hiding scrollbar
    useEffect(() => {
        document.documentElement.classList.add('hide-scrollbar'); // html element
        document.body.classList.add('hide-scrollbar'); // body element
        
        return () => {
            document.documentElement.classList.remove('hide-scrollbar');
            document.body.classList.remove('hide-scrollbar');
        };
    }, []);

    // gallery function
    useEffect(() => {
        gallery_images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        let interval = setInterval(() => {
            setCurrentImage(prev => (prev + 1) % gallery_images.length);
        },5000)
        return () => clearInterval(interval);
    }, []);



    return (
        <>  <Helmet>
                <title>About Me | Gunnar Knox</title>
                <meta
                    name="description"
                    content="Learn more about Gunnar Knox, a full stack web developer from Madison, WI. Discover my skills, experience, and the technologies I work with, including React, Java, and Spring Boot."
                />
            </Helmet>

            <div className='back-button-project' onClick={() => navigate('/')}>
                Back
            </div>
            <a href="/KnoxGunnarResume 2026.pdf" download>
                <div className='resume-button'>
                    <div className='resume-button-text'>Resume</div>
                    <img src='/download-icon.png' className='download-icon'/>
                </div>
            </a>    
            <div className='about-me-header'>
                <div className='about-me-education'>Education</div>
                <div className='about-me-tech-stack'>Tech Stack</div>
            </div>
            <div className='about-me-page-wrapper'>
                
                <div className='about-me-page-container'>
                    <div className='personal-info-container'>
                        <div className='personal-statement'>
                           I'm a full stack developer who enjoys building UX-driven, reliable, and interactive systems.
                           I've worked on projects ranging from real-time multiplayer systems and API driven platforms to ML models.
                           I'm currently focused on strengthening my skills in system design, state-management, and writing maintable code.
                           <br/>Outside of coding I spend my time in the outdoors, snowboarding, taking trips up north, and pretty much any hobby that gets me moving.  
                        </div>
                        <div className='gallery-container'>
                            <img className='gallery-image' src={gallery_images[currentImage]}></img>
                        </div>
                    </div>
                    <div className='education-container'>
                        <div className='education-block'>
                            <div className='education-block-text-flex'>
                                <div className='degree-text'>B.S Computer Sciences</div>
                                <div className='school-text'>University of Wisconsin-Madison</div>
                            </div>
                            <img className='uw-logo' src='Uw-logo.png'></img>
                        </div>
                    </div>
                    <div className='tech-stack-container'>
                        <div className='tech-stack-text'>Tech Stack</div>
                        <div className='tech-stack-nav-bar'>
                            <div className={`tech-stack-nav-bar-option ${showStack === tech_stack ? "tech-stack-selected" : ""}`} onClick={() => setShowStack(tech_stack)}>Languages</div>
                            <div className={`tech-stack-nav-bar-option ${showStack === tech_frameworks ? "tech-stack-selected" : ""}`} onClick={() => setShowStack(tech_frameworks)}>Frameworks</div>
                            <div className={`tech-stack-nav-bar-option ${showStack === tech_tools ? "tech-stack-selected" : ""}`} onClick={() => setShowStack(tech_tools)}>Tools</div>
                        </div>
                        <hr className='tech-stack-divider'></hr>
                        <div className='tech-stack-tools'>
                            {showStack.map((tool) => (
                                <div key={tool.name} className='tech-stack-widget'>
                                    <img src={tool.logo} alt={tool.name}/>
                                    <div className='tech-stack-tool-name'>{tool.name}</div>
                                    <div className='tech-stack-level-bar'>
                                        <div className='tech-stack-level-fill' style={{width: tool.level + '%'}}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='soft-skills-container'>
                        <div className='soft-skills-title'>Soft Skills</div>
                        <div className='soft-skills-widget'>
                            <div className='soft-skills-widget-title'>Scrum/Agile Workflow</div>
                            <div className='soft-skills-widget-content'>
                                <h4 className='widget-content-part-explanation'>Participated in a semester-long Agile team project using sprint planning, daily stand-ups, and code reviews, also acted as Scrum Master.</h4>
                            </div>
                        </div>
                        <div className='soft-skills-widget'>
                            <div className='soft-skills-widget-title'>Team Collaboration</div>
                            <div className='soft-skills-widget-content'>
                                <h4 className='widget-content-part-explanation'>Collaborated on multiple projects by coordinating with team members on code reviews, planning, reviewing pull requests, and clear communication.</h4>
                            </div>
                        </div>
                        <div className='soft-skills-widget'>
                            <div className='soft-skills-widget-title'>UX Design</div>
                            <div className='soft-skills-widget-content'>
                                <h4 className='widget-content-part-explanation'>Focused on development with the user in mind. Emphasized clear flows and usability when implementing features.</h4>
                            </div>
                        </div>
                        <div className='soft-skills-widget'>
                            <div className='soft-skills-widget-title'>Systems Thinking</div>
                            <div className='soft-skills-widget-content'>
                                <h4 className='widget-content-part-explanation'>Considered architectual trade-offs, scalability, and edge cases when designing features.</h4>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default AboutMe;