import { Field, ObjectType } from 'type-graphql';

import { Post } from '../../entities';
import { PageInfo } from '../types';

@ObjectType()
export class PostsResult {
    @Field(() => [Post])
    items: Post[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}
