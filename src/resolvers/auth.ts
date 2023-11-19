import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { SignInInput, SignUpInput } from '../graphql/inputs';
import { SignInResult, SignUpResult } from '../graphql/types';
import { AuthService } from '../services';

@Service()
@Resolver()
export class AuthResolver {
    @Inject()
    private readonly authService!: AuthService;

    @Mutation(() => SignUpResult)
    async signUp(
        @Arg('user') { username, password }: SignUpInput,
        @Ctx() ctx: MyContext,
    ): Promise<SignUpResult> {
        const result = await this.authService.signUp(username, password);

        // Store the user's ID in the session.
        ctx.req.session!.userId = result.user?.id;

        return result;
    }

    @Mutation(() => SignInResult)
    async signIn(
        @Arg('user') { username, password }: SignInInput,
        @Ctx() ctx: MyContext,
    ): Promise<SignInResult> {
        const result = await this.authService.signIn(username, password);

        // Store the user's ID in the session.
        ctx.req.session!.userId = result.user?.id;

        return result;
    }
}
