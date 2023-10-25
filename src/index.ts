import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express, { Express } from 'express';

import { setupApolloServer } from './apollo-server';
import { setupDatabase } from './db';

async function start() {
    const app: Express = express();

    const apolloServer = await setupApolloServer();
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
