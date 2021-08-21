import { observable, action, decorate } from 'mobx';
import L from 'leaflet';
import axios from 'axios';

class MapStore {

    optimizerUrl = process.env.REACT_APP_OTD_API;
    reverseGeocodeUrl = process.env.REACT_APP_GEOCODE_API;
    reverseGeocodeKey = process.env.REACT_APP_GEOCODE_KEY;

    highlightedLocation = null;
    locations = []; // array of objects {latlng: "", label: ""}
    optimizedLocations = []; // array of latLng
    addressMapping = []; // will be used to map the returned lat, lng from
    // the optimizer to their original address for display

    finishedOptimizing = false;
    optimizing = false;

    addLocation(location) {

        // label is not empty, so it was a searched location
        if(location.label !== ""){
            this.locations.push(location);
            return;
        }

        // label is empty, so it was a clicked location.
        // Let's utilize reverse geocode lookup to get an address on the coordinates
        axios.get(`${this.reverseGeocodeUrl}?key=${this.reverseGeocodeKey}&
        lat=${location.latlng.lat}&lon=${location.latlng.lng}&format=json`)
        .then((res) => {
            location.label = res.data.display_name;
            this.locations.push(location);
        })
        .catch((err) => {
            console.log("Unable to reverse geocode");
        })
    }

    removeLocation(index) {
        let removedItem = this.locations.splice(index, 1);
        if(removedItem === this.highlightedLocation)
            this.highlightedLocation = null;
    }

    clearLocations() {
        this.locations = [];
        this.optimizedLocations = [];
    }

    resetOptimizer() {
        this.finishedOptimizing = false;
        this.highlightedLocation = null;
    }

    setHighlightedLocation(index, optimized) {
        this.highlightedLocation = optimized ? this.optimizedLocations[index] : this.locations[index];
    }

    clearHighlightedLocation() {
        this.highlightedLocation = null;
    }

    sendLocationsToOptimizer() {

        this.optimizing = true;
        // add location data to a specific format that is needed by 
        // the optimizer (i.e array of labels and/or "lat, long")
        let unoptimizedLocations = [];

        this.locations.forEach((location, i) => {
            unoptimizedLocations.push(`${location.latlng.lat},${location.latlng.lng}`)
        });

        this.addressMapping = this.locations;
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

            } else if(res.data.status === 'failed') {
                this.optimizing = false;
                alert('Could not optimize your route');
            }else {
                let result = res.data.data; // ['1.2, 2.1' , '3.2, 1.2']

                // parse result into correct latLng object
                result.forEach((result, i ) => {
                    let tokens = result.split(',');

                    let lat = parseFloat(tokens[0]);
                    let lng = parseFloat(tokens[1]);
                    let label = "";
                    
                    // find the original address to each lat, lng   
                    for(let i = 0; i < this.addressMapping.length; i++){
                        if(Math.abs(lat - this.addressMapping[i].latlng.lat) < 0.000000001 && 
                            Math.abs(lng - this.addressMapping[i].latlng.lng) < 0.000000001){
                            label = this.addressMapping[i].label;
                            this.addressMapping.splice(i, 1);
                            break;
                        }
                    }

                    this.optimizedLocations.push({'latlng': new L.latLng(lat, lng), 'label': label});
                });

                // adding first location as last location to create a circular path
                this.optimizedLocations.push(this.optimizedLocations[0]);
                
                this.addressMapping = [];
                this.finishedOptimizing = true;
                this.optimizing = false;
            }
        
        });
    }
}

decorate(MapStore, {
    highlightedLocation: observable,
    locations: observable,
    optimizedLocations: observable,
    finishedOptimizing: observable,
    optimizing: observable,
    setHighlightedLocation: action,
    clearHighlightedLocation: action,
    addLocations: action,
    removeLocation: action,
    sendLocationsToOptimizer: action,
    resetOptimizer: action
});

export default new MapStore();