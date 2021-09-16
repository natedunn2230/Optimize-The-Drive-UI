import {
    postUnoptimizedLocations,
    pollOptimizedLocationsResult,
    reverseAddressLookup
} from "../../requests";
import L from 'leaflet';

export const ROUTE_ADD_LOCATION = "ROUTE_ADD_LOCATION";
export const ROUTE_REMOVE_LOCATION = "ROUTE_REMOVE_LOCATION";
export const ROUTE_RESET_OPTIMIZATION = "ROUTE_RESET_OPTIMIZATION";
export const ROUTE_SET_HIGHLIGHTED_LOCATION = "ROUTE_SET_HIGHLIGHTED_LOCATION";
export const ROUTE_OPTIMIZING = "ROUTE_OPTIMIZING";
export const ROUTE_OPTIMIZED_RESULT = "ROUTE_RESULT";

const addLocation = location => {
    return {
        type: ROUTE_ADD_LOCATION,
        payload: location
    }
};

const removeLocation = idx => {
    return {
        type: ROUTE_REMOVE_LOCATION,
        payload: idx
    }
};

export const resetOptimization = () => {
    return {
        type: ROUTE_RESET_OPTIMIZATION
    }
};

export const setHighlightLocation = idx => {
    return {
        type: ROUTE_SET_HIGHLIGHTED_LOCATION,
        payload: idx
    }
};

export const optimizing = optimizing => {
    return {
        type: ROUTE_OPTIMIZING,
        payload: optimizing
    }
};

export const setOptimizedRoute = locations => {
    return {
        type: ROUTE_OPTIMIZED_RESULT,
        payload: locations
    }
};

/**
 * Functions exposed to react components
 */
export const startOptimization = () => async (dispatch, getState) => {
    const { route } = getState();
    const locations = route.locations;

    dispatch(optimizing(true));
    let unoptimizedLocations = locations.map(location => `${location.latlng.lat},${location.latlng.lng}`);

    postUnoptimizedLocations(unoptimizedLocations).then(res => {
        setTimeout(() => dispatch(pollResult(res.id)), 2500);
    }).catch(err => {
        dispatch(optimizing(false));
        console.error(`an error occurred during server communication: ${err}`);
        alert('Could not optimize the route');

    });
};

const pollResult = resultId => async (dispatch, getState) => {
    const {route} = getState();
    const {locations} = route;

    // repeatedly polls for location
    pollOptimizedLocationsResult(resultId).then(res => {
        const { status, data } = res;
        if(status === 'failed') {
            alert('Could not optimize route');
            console.error('Could not optimize your route');
            dispatch(optimizing(false));
        } else if (status === 'in-progress') {
            setTimeout(() => dispatch(pollResult(resultId)), 2500);
        }
        else {
            const optimizedLocations = data.map(loc => {
                let tokens = loc.split(',');
                let lat = parseFloat(tokens[0]);
                let lng = parseFloat(tokens[1]);
                let label = "";
                // possibly add id field to each location so this can be
                // accomplished in an eaiser manner
                for(let i = 0; i < locations.length; i++){
                    if(Math.abs(lat - locations[i].latlng.lat) < 0.000000001 && 
                        Math.abs(lng - locations[i].latlng.lng) < 0.000000001){
                        label = locations[i].label;
                        break;
                    }
                }

                return {
                    'latlng': new L.latLng(lat, lng),
                    label: label
                };
            });
            
            // adding first location as last location to create a circular path
            optimizedLocations.push(optimizedLocations[0]);
            dispatch(setOptimizedRoute(optimizedLocations));
    }
    }).catch(err => {
        alert('Could not optimize route');
        console.error('Could not optimize your route', err);
        dispatch(optimizing(false));
    });
};

export const addLocationToRoute = location => async (dispatch, getState) => {
    const {route} = getState();
    const {locations} = route;
    // temporary cap at 5 locations
    if(locations.length + 1 > 5) {
        alert('Location count is capped at 5 for demo purposes');
        return;
    }

    // label is not empty, so it was a searched location
    if(location.label !== ""){
        dispatch(addLocation(location));
        return;
    }

    // find address based on coordinates
    reverseAddressLookup(location.latlng.lat, location.latlng.lng).then(name => {
        location.label = name;
        dispatch(addLocation(location));
    }).catch(error => {
        console.error("Unable to reverse coordinates", error);
    });
};

export const removeLocationFromRoute = idx => async (dispatch, __getState) => {
    dispatch(removeLocation(idx));
    dispatch(setHighlightLocation(null));
};

export const highlightLocationInRoute = idx => async (dispatch, __getState) => {
    dispatch(setHighlightLocation(idx));
};

export const restartRoute = () => async (dispatch, __getState) => {
    dispatch(resetOptimization());
};
