import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useDebounce } from "use-debounce";
import "./HomePage.css";

import { getLocationsByAddress } from "../../requests";
import { addLocationToRoute, resetOptimization } from "../../stores/Route/actions";
import carImage from "../../resources/car.svg";
import LoadingSpinner from "../Utils/LoadingSpinner";

const HomePage = () => {

    const [routeStart, setRouteStart] = useState("");
    const [debouncedRouteStart] = useDebounce(routeStart, 1000);
    const [locationOptions, setLocationOptions] = useState([]);
    const [searching, setSearching] = useState(false);
    const noStart = routeStart === ""  || searching || locationOptions.length === 0;

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetOptimization());
    },[dispatch]);

    useEffect(() => {
        if(!debouncedRouteStart) return;
        setSearching(true);
        getLocationsByAddress(debouncedRouteStart, 5).then(locations => {
            setLocationOptions(locations);
        }).catch(error => {
            console.error("Locations not found", error);
            setLocationOptions([]);
        }).finally(() => setSearching(false));
    }, [debouncedRouteStart]);

    // handler functions
    const onProcedeClick = (event) => {
        event.preventDefault();
        getLocationsByAddress(routeStart, 1).then(locations => {
            const { lat, lng, name } = locations[0]; 
            dispatch(addLocationToRoute({label: name, latlng: {lat: lat, lng: lng}}));
            history.push("/map");
        }).catch(error => {
            console.error("Unable to find location", error);
        })
    };

    const handleLocationOnChange = (event) => {
        setRouteStart(event.target.value);
    };

    return (
        <div className="homepage-container">
            <div className="text-image-container">
                <img src={carImage} className="car-image" alt="car icon"/>
                <h1>Optimize The Drive</h1>
                <p>A tool to help you determine the best route for your journeys.</p>
            </div>
            <div className="button-input-container">
                <form
                    onSubmit={onProcedeClick}
                    className="input-container"
                    autoComplete="off"
                >
                    <label htmlFor="start-location">Where would you like to begin?</label>
                    <input
                        size="large"
                        type="text"
                        id="start-location"
                        list="location-names"
                        onChange={handleLocationOnChange}
                        value={routeStart}
                    />
                    <datalist
                        id="location-names"
                    >
                        {locationOptions.map(location => (
                            <option
                                key={location.place_id}
                            >
                                {location.name}
                            </option>
                        ))}
                        {locationOptions.length === 0 &&
                            <option disabled>No Locations</option>
                        }
                    </datalist>
                </form>
                <button
                    disabled={noStart}
                    className={`${"start-button"} ${noStart ? "start-button-disabled" : ""}`}
                    onClick={onProcedeClick}
                    type="submit"
                >
                    {searching
                        ? <LoadingSpinner color="white"/>
                        : <p>START YOUR ROUTE</p>
                    }
                </button>
            </div>
            <footer>
                <p>
                    <i>Developed by <a href="https://github.com/natedunn2230">Nathan Dunn</a>
                    </i>
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
