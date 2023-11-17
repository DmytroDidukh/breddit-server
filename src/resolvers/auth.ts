import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { MyContext } from '../context';
import { SignInInput, SignUpInput } from '../graphql/inputs';
import { SignInResponse, SignUpResponse } from '../graphql/types';
import { AuthService } from '../services';

@Service()
@Resolver()
export class AuthResolver {
    @Inject()
    private readonly authService!: AuthService;

    @Mutation(() => SignUpResponse)
    signUp(@Arg('user') { username, password }: SignUpInput): Promise<SignUpResponse> {
        return this.authService.signUp(username, password);
    }

    @Mutation(() => SignInResponse)
    async signIn(
        @Arg('user') { username, password }: SignInInput,
        @Ctx() ctx: MyContext,
    ): Promise<SignInResponse> {
        const response = await this.authService.signIn(username, password);

        // Store the user's ID in the session.
        ctx.req.session!.userId = response.user?.id;

        return response;
    }
}
