import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { Post } from '../entities';
import { AuthorizationMiddleware } from '../middlewares';
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
    @UseMiddleware(AuthorizationMiddleware)
    createPost(@Arg('title') title: string, @Ctx() ctx: MyContext): Promise<Post> {
        return this.postService.create(title, ctx.req.session!.userId);
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
