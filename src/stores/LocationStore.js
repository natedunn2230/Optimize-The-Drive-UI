import { observable, action, computed, decorate } from 'mobx';


class LocationStore {
    locations = [];

    addLocation(location){
        this.locations.push(location);
        console.log(this.locations);
    }
}

decorate(LocationStore, {
    locations: observable,
    addLocation: action
});

export default new LocationStore();