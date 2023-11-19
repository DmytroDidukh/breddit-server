import { Ctx, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { User } from '../entities';
import { UserService } from '../services';

@Service()
@Resolver()
export class UserResolver {
    @Inject()
    private readonly userService!: UserService;

    @Query(() => User, { nullable: true })
    me(@Ctx() ctx: MyContext): Promise<User | null> {
        return this.userService.getOneById(ctx.req.session!.userId);
    }
}
