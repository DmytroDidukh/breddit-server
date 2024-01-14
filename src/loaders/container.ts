import { IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import RedisStore from 'connect-redis';
import { Container } from 'typedi';

import { Post, Upvote, User } from '../entities';
import { PostRepository, UpvoteRepository, UserRepository } from '../repositories';

function setupContainer(orm: MikroORM<IDatabaseDriver>, redis: RedisStore): void {
    // Container.set(EntityManager, orm.em);
    Container.set(SqlEntityManager, orm.em);
    Container.set(PostRepository, orm.em.getRepository(Post));
    Container.set(UserRepository, orm.em.getRepository(User));
    Container.set(UpvoteRepository, orm.em.getRepository(Upvote));

    Container.set(RedisStore, redis);
}

export { setupContainer };
