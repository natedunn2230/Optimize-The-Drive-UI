import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-routing-machine';

import './Map.css';
import MarkerIcon from "../../../resources/custom-icon.png";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { addLocationToRoute, highlightLocationInRoute } from '../../../stores/Route/actions';
import Delete from '../../../resources/delete_black.svg';

const Map = () => {

    const [routeWaypoints, setRouteWaypoints] = useState([]);

    const dispatch = useDispatch();
    const locations = useSelector(state => state.route.locations);
    const selectedLocation = useSelector(state => state.route.highlightedLocationIdx);
    const finishedOptimizing = useSelector(state => state.route.completed);
    const optimizedLocations = useSelector(state => state.route.optimizedLocations);

    const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    const mapCenter = [locations[0] ? locations[0].latlng.lat: 40, locations[0] ? locations[0].latlng.lng : -84];
    const zoomLevel = locations[0] ? 11 : 6;
    const markerIcon = L.icon({
        iconUrl: MarkerIcon,
        iconSize: [32, 45]
    });

    useEffect(() => {
        const showOptimizedPath = () => { 
            const waypoints = optimizedLocations.map(location => location.latlng);
            setRouteWaypoints(waypoints);
        };

        showOptimizedPath();
    }, [optimizedLocations]);

    const storeClickedLocation = e => {
        let location = {};

        location.latlng = e.latlng;
        location.label = "";
        dispatch(addLocationToRoute(location));
    };

    const storeSearchedLocation = loc => {
        let location = {};

        location.latlng = new L.LatLng(loc.y, loc.x);
        location.label = loc.label;
        
        dispatch(addLocationToRoute(location));
    };

    const renderMarker = () => {
        const handleMarkerClick = index => {
            dispatch(highlightLocationInRoute(index));
        };

        return locations.map((location, index) => {

            const isSelected = selectedLocation === index;

            return (
                <Marker
                    icon={markerIcon}
                    key={`marker-${index}`}
                    position={location.latlng}
                    opacity={(isSelected || selectedLocation === null) ? 1 : 0.4}
                    draggable={false}
                    eventHandlers={{
                        click: () => handleMarkerClick(index),
                    }}
                >
                    <Popup >
                        {`${index + 1}: ${location.label}`}
                        <img className="marker-delete-btn" src={Delete}></img>
                    </Popup>
                </Marker>
            );
        });
    }



    return (
        <div className="map">
            <MapContainer
                doubleClickZoom={false}
                center={mapCenter}
                zoom={zoomLevel}
                attributionControl
                tap={false}
            >
                <TileLayer
                    attribution={tileAttr}
                    url={tileURL}
                />
                <MapActions
                    actions={{
                        dblclick: storeClickedLocation,
                    }}
                />
                <MapSearch
                    onSearch={result => storeSearchedLocation(result.location)}
                />
                <RouteControl
                    waypoints={routeWaypoints}
                    markerIcon={markerIcon}
                />
                {!finishedOptimizing && renderMarker()}
            </MapContainer>
        </div>
    );
};

const MapActions = props => {
    const __events = useMapEvents(props.actions);
    return null;
};

const MapSearch = props => {
    const map = useMap();

    const searchControl = GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        style: 'bar',
        autoClose:true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: false,
        autoCompleteDelay: 100,
        searchLabel: 'Search Location',
        close: false
    });

    useEffect(() => {
        map.addControl(searchControl);
        map.on('geosearch/showlocation', result => props.onSearch(result));
    }, []);

    return null;
};

const RouteControl = props => {

    const map = useMap();

    const routeControl = L.Routing.control({
        routeWhileDragging: false,
        waypoints: props.waypoints,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: {
            styles: [{color: '#7b9c7c', opacity: 1, weight: 3}]
        },
        showAlternatives: false,
        createMarker: function(i, waypoint, __n) {
            const marker = L.marker(waypoint.latLng, {
                icon: props.markerIcon
            });
            return marker;
        }
    });
    
    useEffect(() => {
        if(props.waypoints.length > 0) map.addControl(routeControl);
        return () => map.removeControl(routeControl);
    }, [props.waypoints]);

    return null;
};


export default Map;