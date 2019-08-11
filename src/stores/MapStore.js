import { observable, action, computed, decorate } from 'mobx';
import axios from 'axios';

class MapStore {

    optimizerUrl = 'http://optimize-the-drive-api.herokuapp.com';

    // array of objects {latlng: "", label: ""}
    locations = [];
    optimizedLocations = [];

    addLocation(location) {
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

        this.locations = [];

        // post the unoptimized locations to the server
        axios.post(`${this.optimizerUrl}/optimize`, {'locations': unoptimizedLocations})
        .then((res) => {

            let resultID = res.data.id;
            
            // repeatedly poll the server for the result...since the optimization takes time, we dont 
            // know when it will be finished
            setTimeout(()=> {this.pollResult(resultID)}, 5000);

        }).catch((err) => {console.log(`an error occurred during server communication: ${err}`)});
    }

    pollResult(resultID) {

        // repeatedly polls for location
        axios.get(`${this.optimizerUrl}/optimize/result/${resultID}`).then((res) => {
            if(res.data.status === 'in-progress'){
                setTimeout(()=> {this.pollResult(resultID)}, 5000);

            } else {
                this.optimizedLocations = res.data.data;
            }
        
        });
    }
}

decorate(MapStore, {
    locations: observable,
    optimizedLocations: observable,
    addLocations: action,
    sendLocationsToOptimizer: action
});

export default new MapStore();