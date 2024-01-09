import { Field, ObjectType } from 'type-graphql';

import { Post } from '../../entities';
import { PageInfo } from '../types';

@ObjectType()
export class PaginatedPostsResult {
    @Field(() => [Post])
    posts: Post[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}
