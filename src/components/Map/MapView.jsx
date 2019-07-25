import React from 'react';
import L from 'leaflet';
import './Map.css'
import 'leaflet/dist/leaflet'

export default class MapView extends React.Component{


    render(){
        return(
            <div id="map-container">
                <div id="map"/>
            </div>
            
        );
    }

    componentDidMount() {
        this.map = L.map("map", {
            center: [40, -84],
            zoom: 6,
            maxZoom: 18,
            layers: new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                detectRetina: true,
                maxNativeZoom: 17,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
        });
    }

}