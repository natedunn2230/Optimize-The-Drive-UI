import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Collapse from 'react-collapse';
import Map from '../Utils/Map/Map';
import {Table, TableRow} from '../Utils/Table/Table';
import LoadingSpinner from '../Utils/LoadingSpinner';
import {
    highlightLocationInRoute,
    removeLocationFromRoute,
    restartRoute,
    startOptimization
} from '../../stores/Route/actions';
import './MapPage.css';

import ExpandMore from '../../resources/expand_more.svg';
import ExpandLess from '../../resources/expand_less.svg';
import Restart from '../../resources/restart_white.svg';
import Optimize from '../../resources/start_white.svg';


const MapPage = () => {
    const [tableOpen, setTableOpen] = useState(false);
    const controlsRef = useRef(null);

    const locations = useSelector(state => state.route.locations);
    const optimizedLocations = useSelector(state => state.route.optimizedLocations);
    const optimizing = useSelector(state => state.route.optimizing);
    const finishedOptimizing = useSelector(state => state.route.completed);
    const selectedLocation = useSelector(state => state.route.highlightedLocationIdx);

    const dispatch = useDispatch();

    const disableRestart = locations.length < 1 || optimizing;
    const disableOptimize = locations.length < 2 || optimizing;

    useEffect(() => {
        if(controlsRef && optimizedLocations.length > 0) {
            setTimeout(() => {
                const directionsRef = document.querySelectorAll('.leaflet-routing-container')[0];
            }, 1000);
        }
    }, [controlsRef, optimizedLocations]);

    // adds optimized locations in the order they should be visited to the table
    const renderLocations = () => {

        const handleRemove = idx => {
            dispatch(removeLocationFromRoute(idx));
        };

        const handleLocationClick = idx => {
            dispatch(highlightLocationInRoute(idx));
        };

        if(locations.length === 0 && optimizedLocations.length === 0) {
            return (
                <TableRow key="empty" data={['', 'No Locations Selected', '']}/>
            );
        }

        if(finishedOptimizing){ 
            return optimizedLocations.map((location, index) => {
                const isSelected = selectedLocation === index;
                if(index !== optimizedLocations.length - 1){
                    return (
                        <TableRow
                            selected={isSelected}
                            key={`row-${index}`}
                            data={[`${index + 1}`, `${location.label},`, '']}
                            onClick={() => handleLocationClick(index)}
                        />
                    );
                }
            })
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
                        onRemove={() => handleRemove(index)}
                    />
                );
            });
        }
    };

    const optimizeRoutes = () => {
        if(locations.length > 1 && !optimizing) dispatch(startOptimization());
    }

    const clearRoutes = () => {
        if(window.confirm("Restarting results in lost changes") && locations.length > 0 && !optimizing) dispatch(restartRoute());
    };

    return (
        <div className={'map-page'}>
            <Map />
            <div className="loading-contents">
                {optimizing && <LoadingSpinner text="Optimizing" color="#7b9c7c" />}
            </div>
            <div className="bottom-panel">
                <div className="panel-actions">
                    {!tableOpen &&
                        <img
                            className={`btn-restart panel-btn ${disableRestart ? 'panel-btn-disabled' : ''}`}
                            src={Restart}
                            onClick={clearRoutes}
                        />
                    }

                    <img
                        src={tableOpen ? ExpandMore : ExpandLess}
                        className="btn-expand panel-btn"
                        onClick={() => setTableOpen(open => !open)}
                    />
                    {!tableOpen &&
                        <img
                            className={`btn-optimize panel-btn ${disableOptimize ? 'panel-btn-disabled' : ''}`}
                            src={Optimize}
                            onClick={optimizeRoutes}
                        />
                    }
                </div>
                <div className="location-controls">

                    <Collapse
                        isOpened={tableOpen}
                        initialStyle={{height: '100%'}}
                    >
                        <div className={'table-container'} ref={controlsRef}>

                                <Table
                                    title="Locations"
                                    head={["", `Locations (${locations.length})`]}
                                >
                                    {renderLocations()}
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
