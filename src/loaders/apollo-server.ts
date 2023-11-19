import { ApolloServer } from '@apollo/server';
import 'reflect-metadata'; // We need it before type-graphql
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { MyContext } from '../context';
import { AuthResolver, PostResolver, UserResolver } from '../resolvers';

async function setupApolloServer(): Promise<ApolloServer<MyContext>> {
    try {
        const apolloServer = new ApolloServer<MyContext>({
            schema: await buildSchema({
                resolvers: [PostResolver, AuthResolver, UserResolver],
                validate: true,
                container: Container,
            }),
            // context: ({ req, res }: ReqRes) => ({ em, req, res }),
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
