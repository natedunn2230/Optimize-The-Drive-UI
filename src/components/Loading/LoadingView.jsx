import React from 'react';

import ReactLoading from 'react-loading';

import './Loading.css';

const LoadingView = () => {
    return (
        <div id="loading">
            <span id="loading-header">Optimizing</span>
            <ReactLoading
                type="spinningBubbles"
                color="#4a6fa5"
                width="85px"
                height="85px"
            />
        </div>
    );
}

export default LoadingView;