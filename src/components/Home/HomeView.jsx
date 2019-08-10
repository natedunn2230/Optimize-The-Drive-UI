import React from 'react';
import { inject, observer } from 'mobx-react';

import MapView from '../Utils/Map/MapView';
import TableView from '../Utils/Table/TableView';
import RowView from '../Utils/Table/Row/RowView';
import BannerView from '../Banner/BannerView';

import './Home.css';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.mapStore = this.props.MapStore;

        this.renderSelectedLocations = this.renderSelectedLocations.bind(this);
        this.optimizeRoutes = this.optimizeRoutes.bind(this);
    }

    renderSelectedLocations() {
        return (
            this.mapStore.locations.map((location, index) => {
                return (
                    <RowView key={`row-${index}`}
                        data={[`${index + 1}`, `${location.label}`, `${location.latlng.lat}, ${location.latlng.lng}`]}
                    />
                );
            })
        );
    }

    optimizeRoutes() { this.mapStore.sendLocationsToOptimizer() };

    render() {
        return (
            <div id="map-page">
                <BannerView />
                <div id="map">
                    <MapView />
                </div>
                <div id="table-stuff">
                    <button id="optimize-btn" 
                        className={this.mapStore.locations.length < 5 ? "disabled" : ""}
                        onClick={this.mapStore.locations.length < 5 ? () => {} : this.optimizeRoutes}
                    >
                        OPTIMIZE
                    </button> 
                    <TableView
                        className="text-shadow"
                        title="Locations"
                        head={["Number", "Name", "Location"]}
                    >
                        {this.renderSelectedLocations()}
                    </TableView>
                </div>
            </div>

        );
    }
}

export default inject('MapStore')(observer(Home));