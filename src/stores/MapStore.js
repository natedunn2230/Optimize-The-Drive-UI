import { observable, action, computed, decorate } from 'mobx';


class MapStore {

    // array of objects {latlng: "", label: ""}
    locations = [];

    addLocation(location){
        this.locations.push(location);
    }
}

decorate(MapStore, {
    locations: observable,
    addLocations: action
});

export default new MapStore();