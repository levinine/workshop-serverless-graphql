import React, { Component } from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import style from './Table.module.css'
import Moment from 'react-moment';
class Table extends Component {
    render() {
        return (
            <tr>
                <td ><Moment format="DD.MM.YYYY HH:mm">{this.props.currencies.createdAt}</Moment></td>
                {this.props.currencies.currencies.map(currencie => {
                    return <td key={currencie.name} className={style.price}>&#36;{currencie.price}
                        <span className={currencie.change > 0 ? style.changeGreen : style.changeRed}><b>Change</b>:{currencie.change}</span></td>
                })}
            </tr>
        )
    }
}

export default Table