import React from "react";

import "./Table.css";
import Delete from "../../../resources/delete_black.svg";

export const Table = props => {

    const generateHead = () => {
        return props.head.map((val, index) => {
            return(
                <th key={`header-${index}`}>
                    {val}
                </th>
            );
        });
    };

    return(
        <div className={"table"}>   
            <table>
                <thead>
                    <tr>
                        {generateHead()}
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {props.children}
                </tbody>
            </table> 
        </div>
    );
};

export const TableRow = props => {

    const renderRowData = () => {
        return props.data.map((item, index) => {
            return(
                <td
                    key={`row-${index}`} 
                    onClick={props.onClick}
                    className={props.selected ? "selected" : ""}
                >
                    {item}
                </td>
            );
        });
    };

    return(
        <tr>
            {renderRowData()}
            {props.canRemove && 
                <td className={"delete " + (props.selected ? "selected" : "")} onClick={props.onRemove}>
                    <img src={Delete} alt="delete icon"/>
                </td>
            }
        </tr>
    );
}