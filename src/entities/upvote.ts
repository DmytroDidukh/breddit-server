import {
    AnyEntity,
    Entity,
    ManyToOne,
    BaseEntity as MikroOrmBaseEntity,
    PrimaryKey,
    Property,
    Unique,
} from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';

import { Post } from './post';
import { User } from './user';

import { UpvoteRepository } from '../repositories';

@ObjectType()
@Entity({ customRepository: () => UpvoteRepository })
@Unique({ properties: ['userId', 'postId'] })
export class Upvote extends MikroOrmBaseEntity<AnyEntity, number> {
    @Property({ type: 'int' })
    value: number;

    @PrimaryKey()
    userId: number;

    @ManyToOne(() => User)
    user!: User;

    @PrimaryKey()
    postId: number;

    @ManyToOne(() => Post)
    post!: Post;
}
