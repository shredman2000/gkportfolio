import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './ContactPage.css'

function ContactPage() {
    const navigate = useNavigate();


    return (
        <div className='contact-page-wrapper'>
            <div className='back-button-contact-page' onClick={() => navigate("/")}>Back</div>

            <div className='contact-page-content-wrapper'>
                <div className='get-in-touch-text'>Get In Touch <hr className='get-in-touch-underline'/></div>

                <div className='contact-me-text'>
                    Feel free to reach out to me with things I should work on, job information, or movie recommendations!
                </div>
                <div className='contact-type-wrapper'>
                    <div className='contact-container'style={{marginTop: "3%"}}>
                        <img src='/email-logo.png' className='contact-logo' style={{maxHeight: "40px", marginLeft: "3%"}}></img>
                        <div className='contact-flex'>
                            <div className='contact-type-text'>Email</div>
                            <div className='contact-method-text'>KnoxGunnar@gmail.com</div>
                        </div>
                    </div>
                    <div className='contact-container' style={{gridRow: "1/2", gridColumn: "2/3", marginTop: "3%"}}>
                        <img src='/phone-logo.png' className='contact-logo' style={{maxHeight: "40px", marginLeft: "3%"}}></img>
                        <div className='contact-flex'>
                            <div className='contact-type-text'>Phone</div>
                            <div className='contact-method-text'>+1 (608) 509 5627</div>
                        </div>
                    </div>
                    <div className='contact-container' style={{gridRow: "2/3", gridColumn: "1/2", marginTop: "3%"}} onClick={() => navigate("https://github.com/shredman2000")}>
                        <img src='/githublogo.png' className='contact-logo' style={{maxHeight: "40px", marginLeft: "3%"}}></img>
                        <div className='contact-flex'>
                            <div className='contact-type-text'>GitHub</div>
                            <div className='contact-method-text'>github.com/shredman2000</div>
                        </div>
                    </div>
                    <div className='contact-container' style={{gridRow: "2/3", gridColumn: "2/3", marginTop: "3%"}} onClick={() => navigate("https://www.linkedin.com/in/gunnarknox/")}>
                        <img src='/linkedinlogo.png' className='contact-logo' style={{maxHeight: "40px", marginLeft: "3%"}}></img>
                        <div className='contact-flex'>
                            <div className='contact-type-text'>LinkedIn</div>
                            <div className='contact-method-text'>linkedin.com/in/gunnarknox</div>
                        </div>
                    </div>
                </div>
                <div className='direct-contact-wrapper'>
                    <div className='direct-contact-title'>Or leave me a message</div>
                    <input type='text' className='name-input' placeholder='Name (Optional)'></input>
                    <textarea className='message-input' placeholder='Message...'></textarea>
                    <div className='send-div'>
                        <div>Send Message</div>
                        <img src='/send-icon.png'></img>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ContactPage;