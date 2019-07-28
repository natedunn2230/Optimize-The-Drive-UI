import React from 'react';
import MapView from '../Utils/Map/MapView';
import TableView from '../Utils/Table/TableView';
import RowView from '../Utils/Table/Row/RowView';
import HeadView from '../Utils/Table/Head/HeadView';

import './Styles.css';

export default class Home extends React.Component {

    render(){
        return(
            <div id="map-page">
                <span id="page-header" className="text-shadow">Optimize The Drive</span>
                <MapView/>
                <TableView className="text-shadow" title="Locations">
                    <HeadView head={["NUMBER", "NAME", "LOCATION"]}/>
                    <RowView data={["number", "name", "location"]}/>
                    <RowView data={["number", "name", "location"]}/>
                    <RowView data={["number", "name", "location"]}/>
                </TableView>
            </div>
            
        );
    }
}