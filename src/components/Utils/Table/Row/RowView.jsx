import React from 'react';

export default class RowView extends React.Component {

    renderRowData(){
        return this.props.data.map((item, index) => {
            return(
                <td key={`row-${index}`}>{item}</td>
            );
        });
    }

    render(){
        return(
            <tr>
                {this.renderRowData()}
            </tr>            
        );
    }
}