import { gql } from 'apollo-server-lambda';
import {DataService} from "../services/data.service";

export const typeDefs = gql`
    type Item {
        id: ID!
        createdAt: String!
        currencies: [Currency]!
    }
    
    type Currency {
        imageUrl: String!
        algorithm: String!
        url: String!
        name: String!
        fullName: String!
        price: Float!
        change: Float!
    }
    
    extend type Query {
        currencies: [Item!]!
    }
`;

export const resolvers = {
    Query: {
        currencies: DataService.getCurrencies,
    },
};
