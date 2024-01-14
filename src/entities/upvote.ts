import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';

import { BaseEntity } from './base-entity';
import { Post } from './post';
import { User } from './user';

import { UpvoteRepository } from '../repositories';

@ObjectType()
@Entity({ customRepository: () => UpvoteRepository })
export class Upvote extends BaseEntity {
    @Property({ type: 'int', default: 0 })
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
