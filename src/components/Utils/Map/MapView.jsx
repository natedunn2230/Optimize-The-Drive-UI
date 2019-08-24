import React from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-routing-machine';
import { inject, observer } from 'mobx-react';

import './Map.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

class MapView extends React.Component {

    constructor(props) {
        super(props);

        this.mapStore = this.props.MapStore;
        this.locationStore = this.props.LocationStore;
        this.storeClickedLocation = this.storeClickedLocation.bind(this);

        this.mapRef = React.createRef();

        this.map = null;
        this.routingControl = null;
        this.searchControl = null;
    }

    storeClickedLocation(e) {

        // only want to store clicked locations before the optimization process
        // has begun and has no results
        if(this.mapStore.optimizedLocations.length === 0){
            let location = {};

            location.latlng = e.latlng;
            location.label = "";
    
            this.mapStore.addLocation(location);
        
        }
    }

    storeSearchedLocation(loc) {

        // only want to store searched locations before the optimization process
        // has begun and has no results
        if(this.mapStore.optimizedLocations.length === 0){
            let location = {};

            location.latlng = new L.LatLng(loc.y, loc.x);
            location.label = loc.label;
            
            this.mapStore.addLocation(location);
        }
    }

    renderMarker() {
        return this.mapStore.locations.map((location, index) => {
            return (
                <Marker key={`marker-${index}`} position={location.latlng}>
                    <Popup>{`${location.latlng.lat},${location.latlng.lng}`}</Popup>
                </Marker>
            )
        })
    }

    componentDidMount(){
        this.map = this.mapRef.current.leafletElement;
        
        this.searchControl = new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            style: 'button',
            autoClose:true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: false,
            autoCompleteDelay: 100,
            searchLabel: 'Enter',
        }).addTo(this.map);

        this.routingControl = new L.Routing.control({
            routeWhileDragging: false
        }).addTo(this.map);    
        
        this.map.on('geosearch/showlocation', (result) => {
            this.storeSearchedLocation(result.location);
        })
    }

    showOptimizedPath(){ 
        if(this.mapStore.finishedOptimizing){
            if(this.mapStore.optimizedLocations.length === 0){
                this.routingControl.setWaypoints([]);
                this.mapStore.resetOptimizer();
                return;
            }

            let waypoints = [];
            this.mapStore.optimizedLocations.forEach((location, i) => {
                waypoints.push(location.latlng);
            });
            
            this.routingControl.setWaypoints(waypoints);   
        }
    }

    render() {

        // default attributes for map
        const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        const mapCenter = [40, -84];
        const zoomLevel = 6;

        this.showOptimizedPath();
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