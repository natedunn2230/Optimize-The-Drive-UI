import { observable, action, computed, decorate } from 'mobx';
import L from 'leaflet';
import axios from 'axios';

class MapStore {

    optimizerUrl = 'http://optimize-the-drive-api.herokuapp.com';

    locations = []; // array of objects {latlng: "", label: ""}
    optimizedLocations = []; // array of latLng

    finishedOptimizing = false;
    optimizing = false;

    addLocation(location) {
        this.locations.push(location);
    }

    removeLocation(index) {
        this.locations.splice(index, 1);
    }

    clearLocations() {
        this.locations = [];
        this.optimizedLocations = [];
    }

    resetOptimizer() {
        this.finishedOptimizing = false;
    }

    sendLocationsToOptimizer() {

        this.optimizing = true;
        // add location data to a specific format that is needed by 
        // the optimizer (i.e array of labels and/or "lat, long")
        let unoptimizedLocations = [];

        this.locations.forEach((location, i) => {
            if(location.label !== "N/A")
                unoptimizedLocations.push(location.label);
            else
                unoptimizedLocations.push(`${location.latlng.lat}, ${location.latlng.lng}`)
        });

        this.locations = [];

        // post the unoptimized locations to the server
        axios.post(`${this.optimizerUrl}/optimize`, {'locations': unoptimizedLocations})
        .then((res) => {

            let resultID = res.data.id;
            
            // repeatedly poll the server for the result...since the optimization takes time, we dont 
            // know when it will be finished
            setTimeout(()=> {this.pollResult(resultID)}, 5000);

        }).catch((err) => {
            console.log(`an error occurred during server communication: ${err}`);

            this.optimizing = false;
            alert('Could not optimize your route');
        });
    }

    pollResult(resultID) {

        // repeatedly polls for location
        axios.get(`${this.optimizerUrl}/optimize/result/${resultID}`).then((res) => {
            if(res.data.status === 'in-progress'){
                setTimeout(()=> {this.pollResult(resultID)}, 5000);

            } else {
                let result = res.data.data; // ['1.2, 2.1' , '3.2, 1.2']

                // parse result into correct latLng object
                result.forEach((result, i ) => {
                    let tokens = result.split(',');

                    let lat = parseFloat(tokens[0]);
                    let lng = parseFloat(tokens[1]);

                    this.optimizedLocations.push(new L.latLng(lat, lng));
                });

                // adding first location as last location to create a circular path
                this.optimizedLocations.push(this.optimizedLocations[0]);

                this.finishedOptimizing = true;
                this.optimizing = false;
            }
        
        });
    }
}

decorate(MapStore, {
    locations: observable,
    optimizedLocations: observable,
    finishedOptimizing: observable,
    optimizing: observable,
    addLocations: action,
    removeLocation: action,
    sendLocationsToOptimizer: action,
    resetOptimizer: action
});

export default new MapStore();