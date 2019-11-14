import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import style from './Table.module.css'
class Table extends Component {
    render() {
        return (
            <tr>
                <td >{this.props.currencies.id}</td>
                {this.props.currencies.currencies.map(currencie => {
                    return <td key={currencie.name} className={style.price}>&#36;{currencie.price}
                        <span className={style.change}><b>Change</b>:{currencie.change}</span></td>
                })}
            </tr>
        )
    }
}

export default Table