import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Marker, Popup} from "react-leaflet";
import Collapse from "react-collapse";
import L from "leaflet";

import Map, { MapActions, MapSearch, RouteControl } from "../Utils/Map/Map";
import {Table, TableRow} from "../Utils/Table/Table";
import LoadingSpinner from "../Utils/LoadingSpinner";

import {
    highlightLocationInRoute,
    removeLocationFromRoute,
    restartRoute,
    startOptimization,
    addLocationToRoute,
} from "../../stores/Route/actions";

import "./MapPage.css";

import MarkerIcon from "../../resources/custom-icon.png";
import ExpandMore from "../../resources/expand_more.svg";
import ExpandLess from "../../resources/expand_less.svg";
import Restart from "../../resources/restart_white.svg";
import Optimize from "../../resources/start_white.svg";
import Delete from "../../resources/delete_black.svg";

const MapPage = () => {
    const [routeControlWaypoints, setRouteWaypoints] = useState([]);
    const [tableOpen, setTableOpen] = useState(false);
    
    const controlsRef = useRef(null);
    const dispatch = useDispatch();

    const locations = useSelector(state => state.route.locations);
    const optimizedLocations = useSelector(state => state.route.optimizedLocations);
    const optimizing = useSelector(state => state.route.optimizing);
    const finishedOptimizing = useSelector(state => state.route.completed);
    const selectedLocation = useSelector(state => state.route.highlightedLocationIdx);

    const mapCenter = [locations[0] ? locations[0].latlng.lat : 40, locations[0] ? locations[0].latlng.lng : -95];
    const zoomLevel = (locations && locations[0]) ? 11 : 4;
    const markerIcon = L.icon({
        iconUrl: MarkerIcon,
        iconSize: [32, 45]
    });

    const disableRestart = locations.length < 1 || optimizing;
    const disableOptimize = locations.length < 2 || optimizing;

    useEffect(() => {
        const waypoints = optimizedLocations.map(loc => loc.latlng);
        setRouteWaypoints(waypoints);
    }, [optimizedLocations]);

    const renderTableRows = () => {

        const handleLocationClick = idx => {
            dispatch(highlightLocationInRoute(idx));
        };

        if(locations.length === 0 && optimizedLocations.length === 0) {
            return (
                <TableRow className="no-bottom-border" key="empty" data={["", "No Locations Selected", ""]}/>
            );
        };

        if(optimizing) {
            return<TableRow className="no-bottom-border" key="empty" data={["", <LoadingSpinner text="Optimizing" color="#7b9c7c;"/>, ""]} /> ;
        }

        if(finishedOptimizing){ 
            return optimizedLocations.map((location, index) => {
                const isSelected = selectedLocation === index;
                if(index !== optimizedLocations.length - 1){
                    return (
                        <TableRow
                            selected={isSelected}
                            key={`row-${index}`}
                            data={[String.fromCharCode(97 + index).toUpperCase(), `${location.label},`, ""]}
                            onClick={() => handleLocationClick(index)}
                        />
                    );
                } else return null;
            });
        } else {
            return locations.map((location, index) => {
                const isSelected = selectedLocation === index;
                return (
                    <TableRow
                        canRemove
                        selected={isSelected}
                        key={`row-${index}`}
                        data={[`${index + 1}`, `${location.label}`]}
                        onClick={() => handleLocationClick(index)}
                        onRemove={() => handleRemoveLocation(index)}
                    />
                );
            });
        }
    };

    const optimizeRoutes = () => {
        if(locations.length > 1 && !optimizing) dispatch(startOptimization());
    };

    const clearRoutes = () => {
        if(window.confirm("Restarting results in lost changes") && locations.length > 0 && !optimizing) dispatch(restartRoute());
    };

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

    const handleRemoveLocation = idx => {
        dispatch(removeLocationFromRoute(idx));
    };

    const renderMapMarkers = () => {
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
                        <img className="marker-delete-btn" src={Delete} onClick={() => handleRemoveLocation(index)} alt="delete icon" />
                    </Popup>
                </Marker>
            );
        });
    };

    return (
        <div className={"map-page"}>
            <Map
                defaultZoom={zoomLevel}
                defaultCenter={mapCenter}
            >
                <MapActions
                    actions={{
                        dblclick: storeClickedLocation,
                    }}
                />
                <MapSearch
                    onSearch={result => storeSearchedLocation(result.location)}
                />
                <RouteControl
                    waypoints={routeControlWaypoints}
                    markerIcon={markerIcon}
                    lineColor="#ff3030"
                />
                {!finishedOptimizing && renderMapMarkers()}
            </Map>
            {optimizing && <LoadingSpinner className="spinner" text="Optimizing" color="#ffffff" vertical/>}
            <div className="bottom-panel">
                <div className="panel-actions">
                    {!tableOpen &&
                        <img
                            alt="restart icon"
                            className={`btn-restart panel-btn ${disableRestart ? "panel-btn-disabled" : ""}`}
                            src={Restart}
                            onClick={clearRoutes}
                        />
                    }

                    <img
                        alt="panel control icon"
                        src={tableOpen ? ExpandMore : ExpandLess}
                        className="btn-expand panel-btn"
                        onClick={() => setTableOpen(open => !open)}
                    />
                    {!tableOpen &&
                        <img
                            alt="optimize icon"
                            className={`btn-optimize panel-btn ${disableOptimize ? "panel-btn-disabled" : ""}`}
                            src={Optimize}
                            onClick={optimizeRoutes}
                        />
                    }
                </div>
                <div className="location-controls">

                    <Collapse
                        isOpened={tableOpen}
                        initialStyle={{height: "100%"}}
                    >
                        <div className={"table-container"} ref={controlsRef}>

                                <Table
                                    title="Locations"
                                    head={[
                                        "", `${finishedOptimizing ? "Ordered" : ""} Locations
                                        (${finishedOptimizing ? optimizedLocations.length - 1 : locations.length})`
                                    ]}
                                >
                                    {renderTableRows()}
                                </Table>
                        </div>
                        <div className="btn-group">
                            <button
                                disabled={disableRestart}
                                className="map-btn btn-restart"
                                onClick={clearRoutes}
                            >
                                RESTART
                            </button>
                            <button 
                                disabled={disableOptimize}
                                className="map-btn btn-optimize" 
                                onClick={optimizeRoutes}
                            >
                                OPTIMIZE
                            </button>
                        </div>
                    </Collapse>
                </div>
            </div>
        </div>
    );
};


export default MapPage;
