import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { Post } from '../entities';
import { CreatePostInput, UpdatePostInput } from '../graphql/inputs';
import { CreatePostResult, UpdatePostResult } from '../graphql/results';
import { AuthenticationMiddleware } from '../middlewares';
import { PostService, ValidationService } from '../services';

@Service()
@Resolver()
export class PostResolver {
    @Inject()
    private readonly postService!: PostService;

    @Inject()
    private readonly validationService!: ValidationService;

    @Query(() => [Post])
    @UseMiddleware(AuthenticationMiddleware)
    posts(
        @Arg('limit', () => Int, { nullable: true }) limit: number,
        @Arg('cursor', () => Date, { nullable: true }) cursor: Date | null,
    ): Promise<Post[]> {
        return this.postService.getAll(limit, cursor);
    }

    @Query(() => Post, { nullable: true })
    @UseMiddleware(AuthenticationMiddleware)
    post(@Arg('id') id: number): Promise<Post | null> {
        return this.postService.findOneById(id);
    }

    @Mutation(() => CreatePostResult)
    @UseMiddleware(AuthenticationMiddleware)
    async createPost(
        @Arg('post') postInput: CreatePostInput,
        @Ctx() ctx: MyContext,
    ): Promise<CreatePostResult> {
        const validationResult = await this.validationService.validateInput<CreatePostInput>(
            CreatePostInput,
            postInput,
        );

        if (validationResult) {
            return {
                errors: validationResult,
            };
        }

        return this.postService.create(postInput, ctx.req.session!.userId);
    }

    @Mutation(() => UpdatePostResult)
    @UseMiddleware(AuthenticationMiddleware)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('post') postInput: UpdatePostInput,
        @Ctx() ctx: MyContext,
    ): Promise<UpdatePostResult> {
        const validationResult = await this.validationService.validateInput<UpdatePostInput>(
            UpdatePostInput,
            postInput,
        );

        if (validationResult) {
            return {
                errors: validationResult,
            };
        }

        return this.postService.update(id, postInput, ctx.req.session!.userId);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AuthenticationMiddleware)
    deletePost(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<boolean> {
        return this.postService.delete(id, ctx.req.session!.userId);
    }

    @Query(() => [Post])
    @UseMiddleware(AuthenticationMiddleware)
    postsByAuthor(@Arg('id', () => Int) id: number): Promise<Post[]> {
        return this.postService.getPostsByAuthor(id);
    }
}
