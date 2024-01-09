import {
    Arg,
    Ctx,
    FieldResolver,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { Post } from '../entities';
import { CreatePostInput, UpdatePostInput } from '../graphql/inputs';
import { CreatePostResult, PaginatedPostsResult, UpdatePostResult } from '../graphql/results';
import { AuthenticationMiddleware } from '../middlewares';
import { PostService, ValidationService } from '../services';

@Service()
@Resolver(Post)
export class PostResolver {
    @Inject()
    private readonly postService!: PostService;

    @Inject()
    private readonly validationService!: ValidationService;

    @FieldResolver(() => String)
    contentSnippet(@Root() root: Post) {
        const { content } = root;
        return content.length > 250 ? content.slice(0, 250) + '...' : content;
    }

    @Query(() => PaginatedPostsResult)
    @UseMiddleware(AuthenticationMiddleware)
    posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Date, { nullable: true }) cursor: Date | null,
    ): Promise<PaginatedPostsResult> {
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

    @Query(() => PaginatedPostsResult)
    @UseMiddleware(AuthenticationMiddleware)
    postsByAuthor(
        @Arg('authorId', () => Int) authorId: number,
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Date, { nullable: true }) cursor: Date | null,
    ): Promise<PaginatedPostsResult> {
        return this.postService.getPostsByAuthor(authorId, limit, cursor);
    }
}
