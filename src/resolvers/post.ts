import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { Post } from '../entities';
import { PostService } from '../services';

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
    createPost(@Arg('title') title: string, @Arg('authorId') authorId: number): Promise<Post> {
        return this.postService.create(title, authorId);
    }

    @Mutation(() => Post, { nullable: true })
    updatePost(@Arg('id', () => Int) id: number, @Arg('title') title: string): Promise<Post> {
        return this.postService.update(id, title);
    }

    @Mutation(() => Boolean)
    deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
        return this.postService.delete(id);
    }
}
