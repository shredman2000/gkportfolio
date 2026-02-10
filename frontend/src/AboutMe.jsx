import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


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
        <>
            <div className='about-me-header'>
                <div className='about-me-education'>Education</div>
                <div className='about-me-tech-stack'>Tech Stack</div>
            </div>
            <div className='about-me-page-wrapper'>
                
                <div className='about-me-page-container'>
                    <div className='personal-info-container'>
                        <div className='personal-statement'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet est ac purus ornare convallis nec at velit. Curabitur euismod, nunc sed fermentum vehicula, ipsum justo aliquet augue, rutrum fermentum mi magna nec dui. Duis efficitur justo et dui fringilla cursus. Nulla nunc nibh, commodo et enim mattis, porttitor hendrerit mauris. Pellentesque dolor nunc, egestas id dignissim nec, molestie eget orci. Integer quis sapien ut risus fermentum venenatis vel a lacus. Mauris aliquam augue at suscipit eleifend. Cras elit erat, dignissim sit amet congue eu, porta quis orci. Aenean odio massa, hendrerit eu odio sit amet, finibus ultricies nisl. Vivamus a ex ac quam tincidunt congue. Nam sagittis porttitor mauris, ut tristique justo condimentum non. Cras eu mi bibendum, varius erat id, iaculis elit. Maecenas sit amet aliquet mauris. Vestibulum condimentum nulla justo, ac tincidunt est lacinia quis.
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
                </div>
            </div>
        </>
    )
}
export default AboutMe;