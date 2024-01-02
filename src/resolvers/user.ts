import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { User } from '../entities';
import { AuthenticationMiddleware } from '../middlewares';
import { UserService } from '../services';

@Service()
@Resolver()
export class UserResolver {
    @Inject()
    private readonly userService!: UserService;

    @Query(() => User, { nullable: true })
    @UseMiddleware(AuthenticationMiddleware)
    me(@Ctx() ctx: MyContext): Promise<User | null> {
        return this.userService.getOneById(ctx.req.session!.userId);
    }

    @Query(() => [User])
    @UseMiddleware(AuthenticationMiddleware)
    users(): Promise<User[]> {
        return this.userService.getAll();
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AuthenticationMiddleware)
    async deleteUser(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<boolean> {
        const result = await this.userService.delete(id, ctx.req.session!.userId);

        ctx.req.session!.destroy(() => {});

        return result;
    }
}
