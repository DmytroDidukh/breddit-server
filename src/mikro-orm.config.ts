import { Configuration } from '@mikro-orm/core/utils/Configuration';

import { __prod__ } from './constants';
import { Post } from './entities/Post';

type MikroOrmConfig = {
    entities: (typeof Post)[];
    dbName: string;
    user: string;
    password: string;
    type: keyof typeof Configuration.PLATFORMS;
    debug: boolean;
};

export const mikroOrmConfig: MikroOrmConfig = {
    entities: [Post],
    dbName: 'breddit',
    user: 'postgres',
    password: '875621',
    type: 'postgresql', // Make sure the type property is one of the allowed values
    debug: !__prod__,
};
