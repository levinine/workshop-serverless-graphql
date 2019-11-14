import React, { Component } from 'react';
import style from './App.module.css'
import { Query } from 'react-apollo'
import { GET_CURRENCIES } from "../queries"
import Table from './Table/Table';
import loader from '../assets/loader.gif'


class App extends Component {
  state = {
    columnDefs: [
      { headerName: "Name", field: "name" },
      { headerName: "Price", field: "price" },
      { headerName: "Change", field: "change" }],
    autoGroupColumnDef: {
      headerName: "Group",
      field: "id"
    },



  }
  render() {
    return (
      <Query query={GET_CURRENCIES}>
        {({ data, loading, error }) => {
          if (loading) return <div><img src={loader} alt="loader" className={style.loader} /></div>
          if (error) {
            return <div>Error</div>
          }
          console.log(data.currencies);
          return <div >
            <table className={style.table}>
              <tbody><tr>
                <th>Date</th>
                {data.currencies[0].currencies.map(currencie => {
                  return <th key={currencie.name}>{currencie.name}</th>
                })}
              </tr>
                {data.currencies.map(currencies => {
                  return <Table key={currencies.id} currencies={currencies} />
                })}
              </tbody>
            </table>
          </div>
        }}
      </Query>
    );
  }
}


export default (App);
