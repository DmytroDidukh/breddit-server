import { ApolloServer } from '@apollo/server';
import 'reflect-metadata'; // We need it before type-graphql
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { __prod__ } from '../constants';
import { MyContext } from '../context';
import { AuthResolver, PostResolver, UpvoteResolver, UserResolver } from '../resolvers';
import { ErrorHandlerService } from '../services';

const errorHandler = new ErrorHandlerService();

async function setupApolloServer(): Promise<ApolloServer<MyContext>> {
    try {
        const apolloServer = new ApolloServer<MyContext>({
            schema: await buildSchema({
                resolvers: [PostResolver, AuthResolver, UserResolver, UpvoteResolver],
                validate: false,
                container: Container,
            }),
            formatError: (formattedError) => {
                return errorHandler.handleErrors(formattedError);
            },
            includeStacktraceInErrorResponses: !__prod__,
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
