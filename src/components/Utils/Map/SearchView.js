import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapControl }from 'react-leaflet';

class Search extends MapControl {

    createLeafletElement() {
        return this.searchControl = new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            style: 'button',
            showMarker: true,
            showPopup: false,
            popupFormat: ({query, result}) => console.log(result),
            autoClose: false,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            autoCompleteDelay: 100,
            searchLabel: 'Enter',
        });
    }

    getResult(){
        let x = this.searchControl.result;
    }

    getResult(){

    }
}

export default Search;