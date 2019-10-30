import {ApolloServer} from "apollo-server-lambda";
import {DataService} from "../services/data.service";
import * as schema from '../graphql/schema';

const instantiateApollo = (): ApolloServer => {
    console.log(process.env);
    return new ApolloServer({
        modules: [schema],
        dataSources: () => {
            return {
                contentServiceProvider: new DataService(),
            };
        },
        playground: process.env.NODE_ENV === 'production' ? false : {
            endpoint: process.env.IS_OFFLINE
                ? '/graphql'
                : `/${process.env.STAGE}/graphql`,
        },
        context: {},
    });
};

export const handler = (event: any, context: any, callback: any): void => {
    const server = instantiateApollo();
    const graphqlHandler = server.createHandler();

    // tell AWS lambda we do not want to wait for NodeJS event loop
    // to be empty in order to send the response
    context.callbackWaitsForEmptyEventLoop = false;
    // process the request
    return graphqlHandler(event, context, callback);
};