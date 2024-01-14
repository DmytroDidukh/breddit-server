import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { Upvote } from '../entities';
import { AuthenticationMiddleware } from '../middlewares';
import { UpvoteService } from '../services';

@Service()
@Resolver(Upvote)
export class UpvoteResolver {
    @Inject()
    private readonly upvoteService!: UpvoteService;

    @Mutation(() => Boolean)
    @UseMiddleware(AuthenticationMiddleware)
    vote(
        @Arg('value', () => Int) value: number,
        @Arg('postId', () => Int) postId: number,
        @Ctx() ctx: MyContext,
    ): Promise<boolean> {
        return this.upvoteService.vote(value, ctx.req.session!.userId, postId);
    }
}
