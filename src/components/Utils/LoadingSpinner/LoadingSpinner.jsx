import React from 'react';
import { BeatLoader } from 'react-spinners';

const LoadingSpinner = props => {

    return(
        <div className={`${"loading-spinner"} ${props.className || ""}`}>
            <BeatLoader
                width={props.width || '32px'}
                height={props.height || '32px'}
                color={props.color || 'black'}
            />
            <p color={props.textColor || "black"}>{props.text}</p>
        </div>
    );
};

export default LoadingSpinner;