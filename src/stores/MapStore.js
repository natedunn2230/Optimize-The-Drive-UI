import { observable, action, computed, decorate } from 'mobx';
import axios from 'axios';

class MapStore {

    optimizerUrl = 'optimize-the-drive-api.herokuapp.com';

    // array of objects {latlng: "", label: ""}
    locations = [];
    optimizedLocations = [];

    addLocation(location){
        this.locations.push(location);
    }

    sendLocationsToOptimizer() {

        // add location data to a specific format that is needed by 
        // the optimizer (i.e array of labels and/or "lat, long")
        let unoptimizedLocations = [];

        this.locations.forEach((location, i) => {
            if(location.label !== "N/A")
                unoptimizedLocations.push(location.label);
            else
                unoptimizedLocations.push(`${location.latlng.lat}, ${location.latlng.lng}`)
        });

        axios.post('http://optimize-the-drive-api.herokuapp.com/optimize', {'locations': unoptimizedLocations})
        .then((res) => {console.log(res.data)});
    }
}

decorate(MapStore, {
    locations: observable,
    optimizedLocations: observable,
    addLocations: action,
    sendLocationsToOptimizer: action
});

export default new MapStore();