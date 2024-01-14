import { IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import mikroOrmConfig from '../mikro-orm.config';
// import { Post, User, Upvote } from '../entities';

async function setupDatabase(): Promise<MikroORM<IDatabaseDriver>> {
    try {
        const orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);
        // await orm.em.nativeDelete(Upvote, {});
        // await orm.em.nativeDelete(Post, {});
        // await orm.em.nativeDelete(User, {});
        // await orm.em.flush();
        //
        // // Reset the sequence for the User table
        // await orm.em.execute(`ALTER SEQUENCE user_id_seq RESTART WITH 1`);
        // await orm.em.execute(`ALTER SEQUENCE post_id_seq RESTART WITH 1`);
        await orm.getMigrator().up();

        console.log('DB CONNECTED');

        return orm;
    } catch (error) {
        console.error('DB CONNECTION ERROR: ', error);
        throw error;
    }
}

export { setupDatabase };
