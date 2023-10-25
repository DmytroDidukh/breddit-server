import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express, { Express } from 'express';
import 'reflect-metadata'; // We need it before type-graphql
import { buildSchema } from 'type-graphql';

import { setupDatabase } from './db';
import { RandomResolver } from './resolvers';

async function start() {
    const app: Express = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [RandomResolver],
            validate: false,
        }),
    });

    await apolloServer.start();
    await setupDatabase();

    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(apolloServer));

    app.listen(4000, () => {
        console.log('SERVER STARTED ON PORT 4000');
    });
}

start().catch((err) => {
    console.error(err);
});
