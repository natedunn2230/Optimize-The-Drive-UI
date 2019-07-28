import React from 'react';
import { Map, TileLayer, Marker, Popup, withLeaflet } from 'react-leaflet';
import { inject, observer } from 'mobx-react';

import Search from './SearchView';

import './Map.css'

const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const mapCenter = [40, -84];
const zoomLevel = 6;

class MapView extends React.Component {

    constructor(props) {
        super(props);

        this.mapStore = this.props.MapStore;
        this.locationStore = this.props.LocationStore;
        console.log(props);
        this.addMarker = this.addMarker.bind(this);
    }

    addMarker(e) {
        this.mapStore.addMarker(e);
        this.locationStore.addLocation(e.latlng);
    }

    renderMarker() {
        return this.mapStore.markers.map((marker, index) => {
            return (
                <Marker key={`marker-${index}`} position={marker.latlng}>
                    <Popup>{`${marker.latlng.lat},${marker.latlng.lng}`}</Popup>
                </Marker>
            )
        })
    }

    render() {

        const SearchBar = withLeaflet(Search);
        
        return (
            <div id="map">
                <Map
                    doubleClickZoom={false}
                    onDblClick={this.addMarker}
                    center={mapCenter}
                    zoom={zoomLevel}
                >
                    <TileLayer
                        attribution={tileAttr}
                        url={tileURL}
                    />
                    {this.renderMarker()}
                    <SearchBar/>
                </Map>
            </div>
        );
    }

}

export default inject('MapStore', 'LocationStore')(observer(MapView));