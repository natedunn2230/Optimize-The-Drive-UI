import React from 'react';

export default class HeadView extends React.Component {

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
            <tr>
                {this.generateHead()}
            </tr>
        );
    }
}