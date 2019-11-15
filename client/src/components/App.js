import React, { Component } from 'react';
import style from './App.module.css'
import { Query } from 'react-apollo'
import { GET_CURRENCIES } from "../queries"
import Table from './Table/Table';
import loader from '../assets/loader.gif'


class App extends Component {

  render() {
    return (
      <Query query={GET_CURRENCIES}>
        {({ data, loading, error }) => {
          if (loading) return <div><img src={loader} alt="loader" className={style.loader} /></div>
          if (error) {
            return <div>Error</div>
          }
          return <div >
            <table className={style.table}>
              <tbody><tr>
                <th>Date</th>
                {data.currencies[0].currencies.map(currencie => {
                  return <th key={currencie.name}>{currencie.name}</th>
                })}
              </tr>
                {data.currencies.sort((a, b) => {
                  return -(Number(new Date(a.createdAt)) - Number(new Date(b.createdAt)))
                }).map(currencies => {
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
