import { EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import RedisStore from 'connect-redis';
import { Container } from 'typedi';

import { Post, User } from '../entities';
import { PostRepository, UserRepository } from '../repositories';

function setupContainer(orm: MikroORM<IDatabaseDriver>, redis: RedisStore): void {
    Container.set(EntityManager, orm.em);
    Container.set(PostRepository, orm.em.getRepository(Post));
    Container.set(UserRepository, orm.em.getRepository(User));

    Container.set(RedisStore, redis);
}

export { setupContainer };
