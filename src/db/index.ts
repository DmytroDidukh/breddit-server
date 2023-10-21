import { MikroORM } from '@mikro-orm/core';

import mikroOrmConfig from '../mikro-orm.config';

async function setupDatabase(): Promise<void> {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);
        await orm.getMigrator().up();
    } catch (error) {
        console.error('DB CONNECTION ERROR: ', error);
    }
}

export { setupDatabase };
