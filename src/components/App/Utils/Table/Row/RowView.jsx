import React from 'react';

export default class RowView extends React.Component {

    renderRowData(){
        return this.props.data.map(item => {
            return(
                <td>{item}</td>
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