import { Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { Post } from '../entities/Post';
import { PostService } from '../services/post';

@Service()
@Resolver()
export class PostResolver {
    @Inject()
    private readonly postService!: PostService;

    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return this.postService.getAll();
    }
}
