import { EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { Container } from 'typedi';

import { Post } from '../entities/Post';
import mikroOrmConfig from '../mikro-orm.config';
import { PostRepository } from '../repositories';

async function setupDatabase(): Promise<MikroORM<IDatabaseDriver>> {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);
        await orm.getMigrator().up();

        console.log('DB CONNECTED');

        Container.set(EntityManager, orm.em);
        Container.set(PostRepository, orm.em.getRepository(Post));

        return orm;
    } catch (error) {
        console.error('DB CONNECTION ERROR: ', error);
        throw error;
    }
}

export { setupDatabase };
