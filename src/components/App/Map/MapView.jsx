import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.css'

const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const mapCenter = [40, -84];
const zoomLevel = 6;

export default class MapView extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        };

        this.addMarker = this.addMarker.bind(this);
    }

    addMarker(e) {
        const updatedMarkers = this.state.markers;
        updatedMarkers.push(e.latlng);

        this.setState({markers: updatedMarkers});
    }

    renderMarker() {
        return this.state.markers.map((pos, index) => {
            return(
                <Marker key={`marker-${index}`} position={pos}>
                    <Popup>Something</Popup>
                </Marker>
            )
        })
    }

    render(){
        return(
            <div id="map">
                <Map
                    onClick={this.addMarker}
                    center={mapCenter}
                    zoom={zoomLevel}
                >
                    <TileLayer
                        attribution={tileAttr}
                        url={tileURL}
                    />
                    {this.renderMarker()}
                </Map>
            </div> 
        );
    }

    componentDidMount() {
    
    }

}