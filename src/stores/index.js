import { combineReducers } from "redux";

import routeReducer from "./Route/reducer";

export const appReducer = combineReducers({
    route: routeReducer
});