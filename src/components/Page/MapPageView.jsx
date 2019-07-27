import React from 'react'
import MapView from '../App/Map/MapView'

import './MapPage.css';

export default class MapPageView extends React.Component {

    render(){
        return(
            <div id="map-page">
                <span id="page-header">Optimize The Drive</span>
                <MapView/>
            </div>
            
        );
    }
}