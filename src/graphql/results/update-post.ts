import { Field, ObjectType } from 'type-graphql';

import { Post } from '../../entities';
import { FieldError } from '../types';

@ObjectType()
export class UpdatePostResult {
    @Field(() => Post, { nullable: true })
    post?: Post;

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
