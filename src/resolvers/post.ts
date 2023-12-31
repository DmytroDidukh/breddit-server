import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { Post } from '../entities';
import { CreatePostInput, UpdatePostInput } from '../graphql/inputs';
import { CreatePostResult, UpdatePostResult } from '../graphql/results';
import { AuthorizationMiddleware } from '../middlewares';
import { PostService, ValidationService } from '../services';

@Service()
@Resolver()
export class PostResolver {
    @Inject()
    private readonly postService!: PostService;

    @Inject()
    private readonly validationService!: ValidationService;

    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return this.postService.getAll();
    }

    @Query(() => Post, { nullable: true })
    post(@Arg('id') id: number): Promise<Post | null> {
        return this.postService.getOneById(id);
    }

    @Mutation(() => CreatePostResult)
    @UseMiddleware(AuthorizationMiddleware)
    async createPost(
        @Arg('post') { title, content }: CreatePostInput,
        @Ctx() ctx: MyContext,
    ): Promise<CreatePostResult> {
        const validationResult = await this.validationService.validateInput<CreatePostInput>(
            CreatePostInput,
            {
                title,
                content,
            },
        );

        if (validationResult) {
            return {
                errors: validationResult,
            };
        }

        return this.postService.create(title, content, ctx.req.session!.userId);
    }

    @Mutation(() => UpdatePostResult)
    @UseMiddleware(AuthorizationMiddleware)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('post') { title, content }: UpdatePostInput,
    ): Promise<UpdatePostResult> {
        const validationResult = await this.validationService.validateInput<UpdatePostInput>(
            UpdatePostInput,
            {
                title,
                content,
            },
        );

        if (validationResult) {
            return {
                errors: validationResult,
            };
        }

        return this.postService.update(id, title, content);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AuthorizationMiddleware)
    deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
        return this.postService.delete(id);
    }
}
