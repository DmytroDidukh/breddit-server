import {MikroORM} from '@mikro-orm/core';
import {Post} from "./entities/Post";
import {mikroOrmConfig} from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);

    const post = orm.em.create(Post, {title: 'my first post'});
    // const post = new Post({title: 'my first post'});

    await orm.em.persistAndFlush(post);
}

main().catch(error => {
    console.error(error);
}).finally(() => {
    process.exit(0);
});

// https://youtu.be/I6ypD7qv3Z8?t=1585
