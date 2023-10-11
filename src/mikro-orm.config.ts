import {Post} from "./entities/Post";
import {__prod__} from "./constants";

export const mikroOrmConfig =  {
    entities: [Post],
    dbName: 'breddit',
    user: 'postgres',
    password: '875621',
    type: 'postgresql',
    debug: !__prod__,
} as const;
