import React from 'react';

import "./Row.css";

export default class RowView extends React.Component {

    renderRowData(){
        return this.props.data.map((item, index) => {
            return(
                <td key={`row-${index}`} onClick={this.props.onClick}>{item}</td>
            );
        });
    }

    render(){
        return(
            <tr>
                {this.renderRowData()}
                {this.props.canRemove && 
                    <td className="delete" onClick={this.props.onRemove}>X</td>
                }
            </tr>            
        );
    }
}