import { expressMiddleware } from '@apollo/server/express4';
import RedisStore from 'connect-redis';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import { createClient } from 'redis';

import { setupDatabase } from './db';
import { setupApolloServer } from './loaders/apollo-server';

async function bootstrap() {
    const app: Express = express();

    const redisClient = createClient();
    redisClient.connect().catch(console.error);
    const redisStore = new RedisStore({ client: redisClient });

    const sessionMiddleware = session({
        store: redisStore,
        secret: 'yourSecret', // Use a random secret for production
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: 'auto', // If true the cookie will only be sent over HTTPS, which is recommended
            httpOnly: true, // If true the cookie will only be available to the web server
            maxAge: 1000 * 60 * 60 * 24, // Cookie expiry, which is one day here
        },
    });

    const apolloServer = await setupApolloServer();
    const orm = await setupDatabase();

    app.use(sessionMiddleware);
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

bootstrap().catch((err) => {
    console.error(err);
});
