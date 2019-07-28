import { observable, action, computed, decorate } from 'mobx';


class MapStore {
    markers = [];

    addMarker(marker){
        this.markers.push(marker);
    }
}

decorate(MapStore, {
    markers: observable,
    addMarker: action
});

export default new MapStore();