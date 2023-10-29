import { ApolloServer, BaseContext } from '@apollo/server';
import 'reflect-metadata'; // We need it before type-graphql
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { AuthResolver, PostResolver } from '../resolvers';

async function setupApolloServer(): Promise<ApolloServer<BaseContext>> {
    try {
        const apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers: [PostResolver, AuthResolver],
                validate: false,
                container: Container,
            }),
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
