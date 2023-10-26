import { Arg, Mutation, Query, Resolver } from 'type-graphql';
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

    @Query(() => Post, { nullable: true })
    post(@Arg('id') id: number): Promise<Post | null> {
        return this.postService.getOneById(id);
    }

    @Mutation(() => Post)
    createPost(@Arg('title') title: string): Promise<Post> {
        return this.postService.create(title);
    }
}
