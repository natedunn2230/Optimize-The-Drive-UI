import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import './Map.css'

const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const mapCenter = [40, -84];
const zoomLevel = 12;

export default class MapView extends React.Component{


    render(){
        return(
            <div id="map">
                <Map
                        center={mapCenter}
                        zoom={zoomLevel}
                >
                    <TileLayer
                        attribution={tileAttr}
                        url={tileURL}
                    />
                </Map>
            </div> 
        );
    }

    componentDidMount() {
    
    }

}