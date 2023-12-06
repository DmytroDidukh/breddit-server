import { ApolloServer } from '@apollo/server';
import 'reflect-metadata'; // We need it before type-graphql
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { MyContext } from '../context';
import { AuthResolver, PostResolver, UserResolver } from '../resolvers';
import { ErrorHandlerService } from '../services';

const errorHandler = new ErrorHandlerService();

async function setupApolloServer(): Promise<ApolloServer<MyContext>> {
    try {
        const apolloServer = new ApolloServer<MyContext>({
            schema: await buildSchema({
                resolvers: [PostResolver, AuthResolver, UserResolver],
                validate: false,
                container: Container,
            }),
            formatError: (formattedError) => {
                return errorHandler.handleErrors(formattedError);
            },
        });

        await apolloServer.start();
        console.log('APOLLO SERVER STARTED');

        return apolloServer;
    } catch (error) {
        console.error('APOLLO SERVER ERROR: ', error);
        throw error;
    }
}

export { setupApolloServer };
