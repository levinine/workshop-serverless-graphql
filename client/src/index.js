import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo'


export const client = new ApolloClient(
    {
        uri: 'https://ta9lgzvfgc.execute-api.eu-west-1.amazonaws.com/vuk/graphql',
        fetchOptions: {
            credentials: 'include'
        },
        onError: ({ networkError }) => {
            if (networkError) {
                console.log('Network Error', networkError);
            }
        }
    }
)

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, document.getElementById('root'));

