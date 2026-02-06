import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './ProjectComponent.css';

function ProjectComponent({image, title, description, features, tools, navLink}) {
    const navigate = useNavigate();

    return (
        <div className='project-component-wrapper'>
            <div className='project-image-wrapper'>
                <img src={image} className='project-image2'/>
            </div>
            <p className='project-title'>{title}</p>
            <hr></hr>

            <p className='project-description'>{description}</p>

            <div className='feature-list2'>
                {features.map((feature, index) => (
                    <div key={index} className='feature2'>{feature}</div>
                ))}
            </div>

            <div className='tool-list2'>
                {tools.map((tool, index) => (
                    <div key={index} className='tool2'>{tool}</div>
                ))}
            </div>
            <div className='visit-site-button2' onClick={() => navigate(navLink)}>
                <p className='visit-site-text2'>Visit Site</p>
                <img src='/link-icon.png' className='link-image2'></img>
            </div>

        
        
        </div>
    )
}
export default ProjectComponent;