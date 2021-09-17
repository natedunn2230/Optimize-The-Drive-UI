import React, { useEffect } from "react";
import L from "leaflet";
import { 
    MapContainer, TileLayer,
    useMapEvents, useMap, Marker, Popup
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-routing-machine";

import "./Map.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import Delete from "../../../resources/delete_black.svg";
import MarkerIcon from "../../../resources/custom-icon.png";

const markerIcon = L.icon({
    iconUrl: MarkerIcon,
    iconSize: [32, 45]
});

const Map = props => {

    const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
        <div className="map">
            <MapContainer
                doubleClickZoom={false}
                center={props.defaultCenter}
                zoom={props.defaultZoom}
                attributionControl
                tap={false}
            >
                {props.children}
                <TileLayer
                    attribution={tileAttr}
                    url={tileURL}
                />
            </MapContainer>
        </div>
    );
};

export const MapActions = props => {
    const __events = useMapEvents(props.actions);
    return null;
};

export const MapSearch = props => {
    const map = useMap();

    const searchControl = GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        style: "bar",
        autoClose:true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: false,
        autoCompleteDelay: 100,
        searchLabel: "Search Location",
        close: false
    });

    useEffect(() => {
        map.addControl(searchControl);
        map.on("geosearch/showlocation", result => props.onSearch(result));
    }, [map]);

    return null;
};

export const RouteControl = props => {
    const map = useMap();

    const routeControl = L.Routing.control({
        routeWhileDragging: false,
        waypoints: props.waypoints,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: {
            styles: [{color: props.lineColor, opacity: 1, weight: 3}]
        },
        showAlternatives: false,
        createMarker: function(i, waypoint, __n) {
            const marker = L.marker(waypoint.latLng, {
                icon: markerIcon
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

export const MapMarker = props => {
    return (
        <Marker
            id={props.id}
            icon={markerIcon}
            position={props.location.latlng}
            opacity={props.opacity}
            draggable={false}
            eventHandlers={{
                click: props.onClick
            }}
        >
            <Popup >
                {props.label}
                <img
                    className="marker-delete-btn"
                    src={Delete}
                    onClick={props.onRemove}
                    alt="delete icon"
                />
            </Popup>
        </Marker>
    );
};

export default Map;
