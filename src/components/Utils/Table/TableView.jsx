import React from 'react';

import './Table.css';

export default class TableView extends React.Component {

    generateHead(){
        let headers = this.props.head;

        return headers.map((val, index) => {
            return(
                <th key={`header-${index}`}>
                    {val}
                </th>
            );
        });
    }

    render(){
        return(
            <div>
                <h1 className="title">{this.props.title}</h1>
                <div id="scroll">   
                    <table id="table">
                        <thead>
                            <tr>
                                {this.generateHead()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table> 
                </div>
            </div>
        );
    }
}