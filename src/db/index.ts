import { EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { Container } from 'typedi';

import { Post, User } from '../entities';
import mikroOrmConfig from '../mikro-orm.config';
import { PostRepository, UserRepository } from '../repositories';

async function setupDatabase(): Promise<MikroORM<IDatabaseDriver>> {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);
        await orm.getMigrator().up();

        console.log('DB CONNECTED');

        Container.set(EntityManager, orm.em);
        Container.set(PostRepository, orm.em.getRepository(Post));
        Container.set(UserRepository, orm.em.getRepository(User));

        return orm;
    } catch (error) {
        console.error('DB CONNECTION ERROR: ', error);
        throw error;
    }
}

export { setupDatabase };
