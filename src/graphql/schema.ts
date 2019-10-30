import { gql } from 'apollo-server-lambda';
import {DataService} from "../services/data.service";

export const typeDefs = gql`
  extend type Query {
    data: String
  }
`;

export const resolvers = {
    Query: {
        data: new DataService().getHello,
    },
};
