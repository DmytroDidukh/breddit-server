import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from './BaseEntity';

import { PostRepository } from '../repositories';

@ObjectType()
@Entity({ customRepository: () => PostRepository })
export class Post extends BaseEntity {
    @Field()
    @Property({ type: 'text' })
    title!: string;
}
