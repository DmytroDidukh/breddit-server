import { IDatabaseDriver, MikroORM } from '@mikro-orm/core';

import mikroOrmConfig from '../mikro-orm.config';

async function setupDatabase(): Promise<MikroORM<IDatabaseDriver>> {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);
        await orm.getMigrator().up();

        console.log('DB CONNECTED');

        return orm;
    } catch (error) {
        console.error('DB CONNECTION ERROR: ', error);
        throw error;
    }
}

export { setupDatabase };
