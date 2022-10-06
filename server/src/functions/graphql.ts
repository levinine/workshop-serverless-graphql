import {ApolloServer} from "apollo-server-lambda";
import * as schema from '../graphql/schema';

const instantiateApollo = (): ApolloServer => {
    console.log(process.env);
    return new ApolloServer({
        modules: [schema],
        csrfPrevention: true,
        plugins: []
    });
};

export const handler = (event: any, context: any, callback: any): void | Promise<any> => {
    const server = instantiateApollo();
    const graphqlHandler = server.createHandler();

    // tell AWS lambda we do not want to wait for NodeJS event loop
    // to be empty in order to send the response
    context.callbackWaitsForEmptyEventLoop = false;
    // process the request
    return graphqlHandler(event, context, callback);
};