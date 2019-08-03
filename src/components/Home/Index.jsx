import React from 'react';
import { inject, observer } from 'mobx-react';

import MapView from '../Utils/Map/MapView';
import TableView from '../Utils/Table/TableView';
import RowView from '../Utils/Table/Row/RowView';

import './Styles.css';

class Home extends React.Component {

    constructor(props){
        super(props);
        this.mapStore = this.props.MapStore;

        this.renderSelectedLocations = this.renderSelectedLocations.bind(this);
    }

    renderSelectedLocations(){
        return(
            this.mapStore.locations.map((location, index) => {
                return(
                    <RowView key={`row-${index}`}
                        data={[`${index + 1}`, `${location.label}`, `${location.latlng.lat}, ${location.latlng.lng}`]}
                    />
                );
            })
        );
    }

    render(){
        return(
            <div id="map-page">
                <span id="page-header" className="text-shadow">Optimize The Drive</span>
                <MapView/>
                <TableView 
                    className="text-shadow"
                    title="Locations"
                    head={["Number", "Name", "Location"]}
                >
                    {this.renderSelectedLocations()}
                </TableView>
            </div>
            
        );
    }
}

export default inject('MapStore')(observer(Home));