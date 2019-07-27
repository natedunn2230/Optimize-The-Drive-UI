import React from 'react';

import './Table.css';

export default class TableView extends React.Component {

    render(){
        return(
            <div>
                <h1>{this.props.title}</h1>
                <table id="table">
                    {this.props.children}
                </table>
            </div>

        );
    }
}