import { IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import mikroOrmConfig from '../mikro-orm.config';

async function setupDatabase(): Promise<MikroORM<IDatabaseDriver>> {
    try {
        const orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);
        await orm.getMigrator().up();

        console.log('DB CONNECTED');

        return orm;
    } catch (error) {
        console.error('DB CONNECTION ERROR: ', error);
        throw error;
    }
}

export { setupDatabase };
