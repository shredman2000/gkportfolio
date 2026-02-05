import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import './AboutMe.css';

function AboutMe() {


    return (
        <div className='about-me-wrapper'>
            <div className='about-me-paragraph'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis elit quis justo bibendum, consequat porta nisl luctus. Vivamus a sapien pharetra, ornare dolor vel, eleifend metus. Nulla suscipit diam ut sagittis imperdiet. Curabitur sed consectetur arcu. Suspendisse luctus quis odio tempus cursus. Maecenas vitae nisl non augue commodo suscipit. Suspendisse tincidunt metus sit amet massa placerat, non ullamcorper nulla congue. Fusce tempus porta fringilla. Praesent gravida diam pulvinar enim tristique eleifend. Proin lobortis quis libero eget porta. Phasellus lorem magna, sollicitudin sit amet tristique id, vehicula a justo.
            </div>
            <div className='about-me-education-wrapper'>
                <h1>Education</h1>
                <div className='education-blurb'>
                    <div className='education-text-wrapper' style={{display: 'flex', flexDirection: 'column'}}>
                        <div className='degree-text'>B.S Computer Sciences</div>
                        <div className='uw-madison-text' style={{color: "black"}}>University of Wisconsin-Madison</div>
                    </div>
                    <img src='/Uw-logo.png' style={{maxHeight: '100px', marginLeft: 'auto'}}></img>

                </div>
            </div>
            <div className='about-me-interests-wrapper'>

            </div>
        </div>
    )
}
export default AboutMe;