import React from 'react';
import MapView from '../App/Map/MapView';
import TableView from '../App/Utils/Table/TableView';
import RowView from '../App/Utils/Table/Row/RowView';
import HeadView from '../App/Utils/Table/Head/HeadView';

import './MapPage.css';

export default class MapPageView extends React.Component {

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