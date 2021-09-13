import {
    ROUTE_ADD_LOCATION,
    ROUTE_REMOVE_LOCATION,
    ROUTE_SET_HIGHLIGHTED_LOCATION,
    ROUTE_OPTIMIZING,
    ROUTE_RESET_OPTIMIZATION,
    ROUTE_OPTIMIZED_RESULT
} from './actions';

const initialState = {
    highlightedLocationIdx: null,
    locations: [],
    optimizedLocations: [],
    completed: false,
    optimizing: false
};

const routeReducer = (state = initialState, action) => {
    switch(action.type) {
        case ROUTE_ADD_LOCATION:
            return {
                ...state,
                locations: [...state.locations, action.payload],
                highlightedLocationIdx: null
            };
        case ROUTE_REMOVE_LOCATION:
            return {
                ...state,
                locations: state.locations.filter((__loc, i) => i !== action.payload)
            };
        case ROUTE_SET_HIGHLIGHTED_LOCATION:
            return {
                ...state,
                highlightedLocationIdx: action.payload !== state.highlightedLocationIdx ? action.payload : null
            };
        case ROUTE_OPTIMIZING:
            return {
                ...state,
                optimizing: action.payload
            };
        case ROUTE_OPTIMIZED_RESULT:
            return {
                ...state,
                optimizedLocations: action.payload,
                optimizing: false,
                completed: true
            };
        case ROUTE_RESET_OPTIMIZATION:
            return initialState;
        default:
            return state;
    }
};

export default routeReducer;