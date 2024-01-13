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
import { User } from '../entities';
import { AuthenticationMiddleware } from '../middlewares';
import { UserService } from '../services';

@Service()
@Resolver(User)
export class UserResolver {
    @Inject()
    private readonly userService!: UserService;

    @FieldResolver(() => String)
    email(@Root() root: User, @Ctx() ctx: MyContext) {
        const { userId } = ctx.req.session!;

        if (userId === root.id) {
            return root.email;
        }

        return '';
    }

    @Query(() => User, { nullable: true })
    @UseMiddleware(AuthenticationMiddleware)
    me(@Ctx() ctx: MyContext): Promise<User | null> {
        return this.userService.findOneById(ctx.req.session!.userId);
    }

    @Query(() => [User])
    @UseMiddleware(AuthenticationMiddleware)
    users(): Promise<User[]> {
        return this.userService.getAll();
    }

    @Query(() => User, { nullable: true })
    @UseMiddleware(AuthenticationMiddleware)
    user(@Arg('id', () => Int) id: number): Promise<User | null> {
        return this.userService.findOneById(id);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AuthenticationMiddleware)
    async deleteUser(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<boolean> {
        const result = await this.userService.delete(id, ctx.req.session!.userId);

        ctx.req.session!.destroy(() => {});

        return result;
    }
}
