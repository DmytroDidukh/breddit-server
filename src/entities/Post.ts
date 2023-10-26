import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

import { PostRepository } from '../repositories';

@ObjectType()
@Entity({ customRepository: () => PostRepository })
export class Post {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: 'text' })
    title!: string;

    @Field()
    @Property({ type: 'date', default: 'now()' })
    createdAt?: Date;

    @Field()
    @Property({ type: 'date', default: 'now()', onUpdate: () => new Date() })
    updatedAt?: Date;
}
