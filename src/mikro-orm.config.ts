import path from 'path';

import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { __prod__ } from './constants';
import { Post, Upvote, User } from './entities';

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    allowGlobalContext: true,
    entities: [Post, User, Upvote],
    dbName: 'breddit',
    user: 'postgres',
    password: '875621',
    type: 'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init<PostgreSqlDriver>>[0];
