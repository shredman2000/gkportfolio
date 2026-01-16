import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './BarComponent.css'



export default function BarComponent({value, onChange, min = 0, max = 10, step = 1, title}) {


    return (
        <div className='bar-wrapper'>
            <div className='bar-info-wrapper'>
                <div className='bar-label-wrapper'>
                    <div className='bar-label'>
                        {title}
                    </div>
                </div>
                <div className='bar-value-wrapper'>
                    <div className='bar-value'>
                        {value}
                    </div>
                </div>
            </div>
            <div className='bar-slider-container'>
                <div style = {{width: 300}}>
                    <Slider min={min} max={max} step={step} value={value} onChange={onChange}
                        className="bar-slider"
                        handleRender={() => null} // hides the knob that the user pulls
                    />
            </div>
            
            </div>
        </div>
    );
}