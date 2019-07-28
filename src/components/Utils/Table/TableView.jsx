import React from 'react';

import './Table.css';

export default class TableView extends React.Component {

    render(){
        return(
            <div>
                <h1 className="title">{this.props.title}</h1>
                <table id="table">
                    <tbody>
                        {this.props.children}
                    </tbody>
                </table>
            </div>
        );
    }
}