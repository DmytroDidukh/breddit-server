import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express, { Express } from 'express';
import 'reflect-metadata'; // We need it before type-graphql
import { buildSchema } from 'type-graphql';

import { setupDatabase } from './db';
import { PostResolver } from './resolvers';

async function start() {
    const app: Express = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver],
            validate: false,
        }),
    });

    await apolloServer.start();
    const orm = await setupDatabase();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async () => ({ em: orm.em }),
        }),
    );

    app.listen(4000, () => {
        console.log('SERVER STARTED ON PORT 4000');
    });
}

start().catch((err) => {
    console.error(err);
});
