import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import RedisStore from 'connect-redis';
import { Request, Response } from 'express';

export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request /* & { session: Express.Session }*/;
    res: Response;
    redis: RedisStore;
};
