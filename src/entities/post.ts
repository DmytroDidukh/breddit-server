import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from './base-entity';
import { User } from './user';

import { PostRepository } from '../repositories';

@ObjectType()
@Entity({ customRepository: () => PostRepository })
export class Post extends BaseEntity {
    @Field()
    @Property({ type: 'text' })
    title!: string;

    @Field()
    @Property({ type: 'text' })
    content!: string;

    @Field()
    @Property({ type: 'int', default: 0 })
    points?: number;

    @Field()
    @ManyToOne(() => User)
    author!: User;
}
