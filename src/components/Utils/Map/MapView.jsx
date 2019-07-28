import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { inject, observer } from 'mobx-react';

import './Map.css'

const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const mapCenter = [40, -84];
const zoomLevel = 6;

class MapView extends React.Component{

    constructor(props) {
        super(props);

        this.store = this.props.MapStore;
        this.addMarker = this.addMarker.bind(this);
    }

    addMarker(e) {
        this.store.addMarker(e.latlng);
    }

    renderMarker() {
        return this.store.markers.map((pos, index) => {
            return(
                <Marker key={`marker-${index}`} position={pos}>
                    <Popup>{`${pos.lat},${pos.lng}`}</Popup>
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

}

export default inject('MapStore')(observer(MapView));