import React, { useEffect, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Collapse from "react-collapse";
import ReactTooltip from "react-tooltip";
import L from "leaflet";

import Map, { MapActions, MapSearch, RouteControl, MapMarker, MapSnap } from "../Utils/Map/Map";
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

import ExpandMore from "../../resources/expand_more.svg";
import ExpandLess from "../../resources/expand_less.svg";
import Restart from "../../resources/restart_white.svg";
import Optimize from "../../resources/start_white.svg";

const MapPage = () => {
    const [routeControlWaypoints, setRouteWaypoints] = useState([]);
    const [tableOpen, setTableOpen] = useState(false);
    
    const controlsRef = createRef();
    const dispatch = useDispatch();

    const locations = useSelector(state => state.route.locations);
    const optimizedLocations = useSelector(state => state.route.optimizedLocations);
    const optimizing = useSelector(state => state.route.optimizing);
    const finishedOptimizing = useSelector(state => state.route.completed);
    const selectedLocation = useSelector(state => state.route.highlightedLocationIdx);

    const mapCenter = [locations[0] ? locations[0].latlng.lat : 40, locations[0] ? locations[0].latlng.lng : -95];
    const zoomLevel = (locations && locations[0]) ? 11 : 4;

    const disableRestart = locations.length < 1 || optimizing;
    const disableOptimize = locations.length < 2 || optimizing;

    const locationIterable = finishedOptimizing ? optimizedLocations : locations;
    const snapCoord = selectedLocation &&
        {
            lat: locationIterable[selectedLocation].latlng.lat,
            lon: locationIterable[selectedLocation].latlng.lng
        };

    useEffect(() => {
        const waypoints = optimizedLocations.map(loc => loc.latlng);
        setRouteWaypoints(waypoints);
    }, [optimizedLocations]);

    /** Handlers */
    const handleLocationClick = idx => {
        dispatch(highlightLocationInRoute(idx));
    };

    const optimizeRoutes = () => {
        if(!disableOptimize) dispatch(startOptimization());
    };

    const clearRoutes = () => {
        if(!disableRestart && window.confirm("Restarting results in lost changes") && locations.length > 0 && !optimizing) dispatch(restartRoute());
    };

    const storeClickedLocation = e => {
        if(finishedOptimizing) return;

        let location = {};

        location.latlng = e.latlng;
        location.label = "";

        dispatch(addLocationToRoute(location));
    };

    const storeSearchedLocation = loc => {
        if(finishedOptimizing) return;

        let location = {};

        location.latlng = new L.LatLng(loc.y, loc.x);
        location.label = loc.label;
        
        dispatch(addLocationToRoute(location));
    };

    const handleRemoveLocation = idx => {
        dispatch(removeLocationFromRoute(idx));
    };
    //---------------------------

    /** Render Functions */
    const renderTableRows = () => {
        if(locations.length === 0 && optimizedLocations.length === 0) {
            return (
                <TableRow className="no-bottom-border" key="empty" data={["", "No Locations Selected", ""]}/>
            );
        };

        if(optimizing) {
            return<TableRow className="no-bottom-border" key="empty" data={["", <LoadingSpinner text="Optimizing" color="#7b9c7c;"/>, ""]} /> ;
        }

        return locationIterable.map((location, index) => {
            const isSelected = selectedLocation === index;
            const tableData = finishedOptimizing ? [`${index + 1}`, `${location.label},`, ""] : [`${index + 1}`, `${location.label}`];
            if(finishedOptimizing && locationIterable.length - 1 === index) return null;
            return (
                <TableRow
                    canRemove={!finishedOptimizing}
                    selected={isSelected}
                    key={`row-${index}`}
                    data={tableData}
                    onClick={() => handleLocationClick(index)}
                    onRemove={finishedOptimizing ? null : () => handleRemoveLocation(index)}
                />
            );
        });
    };

    const renderMapMarkers = () => {
        return locationIterable.map((location, index) => {
            if(finishedOptimizing && index === locationIterable.length - 1) return null;

            const isSelected = selectedLocation === index;
            return(
                <MapMarker
                    key={`marker-${index}`}
                    location={location}
                    opacity={(isSelected || selectedLocation === null) ? 1 : 0.4}
                    onClick={() => handleLocationClick(index)}
                    onRemove={finishedOptimizing ? null : () => handleRemoveLocation(index)}
                    label={`${index + 1}: ${location.label}`}
                    forceLabelShow={isSelected}
                />
            );
        });
    };
    // -------------------------

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
                <MapSnap
                    snapCoord={snapCoord}
                />
                <RouteControl
                    waypoints={routeControlWaypoints}
                    lineColor="#ff3030"
                    resultsHtmlContainer={controlsRef}
                />
                {renderMapMarkers()}
            </Map>
            {optimizing && <LoadingSpinner className="spinner" text="Optimizing" color="#ffffff" vertical/>}
            <div className="bottom-panel">
                <div className="panel-actions">
                    {!tableOpen &&
                        <>
                            <img
                                data-tip="Restart"
                                data-for="restart-tooltip"
                                alt="restart icon"
                                className={`btn-restart panel-btn ${disableRestart ? "panel-btn-disabled" : ""}`}
                                src={Restart}
                                onClick={clearRoutes}
                            />
                            <ReactTooltip id="restart-tooltip"/>
                        </>
                    }
                    <img
                        alt="panel control icon"
                        src={tableOpen ? ExpandMore : ExpandLess}
                        className="btn-expand panel-btn"
                        onClick={() => setTableOpen(open => !open)}
                    />
                    {!tableOpen &&
                        <>
                            <img
                                data-tip="Optimize"
                                data-for="optimize-tooltip"
                                alt="optimize icon"
                                className={`btn-optimize panel-btn ${disableOptimize ? "panel-btn-disabled" : ""}`}
                                src={Optimize}
                                onClick={optimizeRoutes}
                            />
                            <ReactTooltip id="optimize-tooltip"/>
                        </>
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
