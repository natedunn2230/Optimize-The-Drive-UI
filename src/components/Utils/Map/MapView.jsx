import React from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { inject, observer } from 'mobx-react';

import './Map.css'

class MapView extends React.Component {

    constructor(props) {
        super(props);

        this.mapStore = this.props.MapStore;
        this.locationStore = this.props.LocationStore;
        this.storeClickedLocation = this.storeClickedLocation.bind(this);

        this.mapRef = React.createRef();

    }

    storeClickedLocation(e) {
        let location = {};

        location.latlng = e.latlng;
        location.label = "";

        this.mapStore.addLocation(location);
    }

    storeSearchedLocation(loc) {
        let location = {};

        location.latlng = new L.LatLng(loc.y, loc.x);
        location.label = loc.label;
        
        this.mapStore.addLocation(location);
    }

    renderMarker() {
        return this.mapStore.locations.map((location, index) => {
            return (
                <Marker key={`marker-${index}`} position={location.latlng}>
                    <Popup>{`${location.lat},${location.lng}`}</Popup>
                </Marker>
            )
        })
    }

    componentDidMount(){
        const map = this.mapRef.current.leafletElement;

        const searchControl = new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            style: 'button',
            autoClose: false,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: false,
            autoCompleteDelay: 100,
            searchLabel: 'Enter',
        }).addTo(map);

        map.on('geosearch/showlocation', (result) => {
            this.storeSearchedLocation(result.location);
        })
    }

    render() {

        // default attributes for map
        const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        const mapCenter = [40, -84];
        const zoomLevel = 6;
        
        return (
            <div id="map">
                <Map
                    doubleClickZoom={false}
                    onDblClick={this.storeClickedLocation}
                    center={mapCenter}
                    zoom={zoomLevel}
                    ref={this.mapRef}>
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