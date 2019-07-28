import React from 'react';
import { inject, observer } from 'mobx-react';

import MapView from '../Utils/Map/MapView';
import TableView from '../Utils/Table/TableView';
import RowView from '../Utils/Table/Row/RowView';

import './Styles.css';

class Home extends React.Component {

    constructor(props){
        super(props);
        this.locationStore = this.props.LocationStore;

        this.renderRows = this.renderRows.bind(this);
    }

    renderRows(){
        return(
            this.locationStore.locations.map((location, index) => {
                return(
                    <RowView key={`row-${index}`}
                        data={[`${index + 1}`, `${location.lat}, ${location.lng}`]}
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
                    head={["NUMBER", "LOCATION"]}
                >
                    {this.renderRows()}
                </TableView>
            </div>
            
        );
    }
}

export default inject('LocationStore')(observer(Home));