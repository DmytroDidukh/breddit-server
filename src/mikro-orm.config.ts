import path from 'path';

import { MikroORM } from '@mikro-orm/core';

import { __prod__ } from './constants';
import { Post } from './entities/Post';

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post],
    dbName: 'breddit',
    user: 'postgres',
    password: '875621',
    type: 'postgresql', // Make sure the type property is one of the allowed values
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
