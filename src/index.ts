import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';

import { __prod__, COOKIE_NAME } from './constants';
import { setupApolloServer, setupContainer, setupDatabase, setupRedisStore } from './loaders';

async function bootstrap() {
    const app: Express = express();
    const redisStore = setupRedisStore();

    const sessionMiddleware = session({
        name: COOKIE_NAME,
        store: redisStore,
        secret: 'ytjghj5yy654tkjhnkfxcfewrtwe',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: __prod__, // cookie only works in https
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            sameSite: 'lax',
        },
    });

    const orm = await setupDatabase();
    setupContainer(orm, redisStore);
    const apolloServer = await setupApolloServer();

    app.use(sessionMiddleware);
    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: ['https://sandbox.embed.apollographql.com', 'http://localhost:3000'],
            credentials: true,
        }),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => ({ em: orm.em, req, res, redis: redisStore }),
        }),
    );

    app.listen(4000, () => {
        console.log('SERVER STARTED ON PORT 4000');
    });
}

bootstrap().catch((err) => {
    console.error(err);
});
