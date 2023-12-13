import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { COOKIE_NAME } from '../constants';
import { MyContext } from '../context';
import { SignInInput, SignUpInput } from '../graphql/inputs';
import { SignInResult, SignUpResult } from '../graphql/types';
import { AuthService, ValidationService } from '../services';

@Service()
@Resolver()
export class AuthResolver {
    @Inject()
    private readonly authService!: AuthService;
    @Inject()
    private readonly validationService!: ValidationService;

    @Mutation(() => SignUpResult)
    async signUp(
        @Arg('user') { username, password }: SignUpInput,
        @Ctx() ctx: MyContext,
    ): Promise<SignUpResult> {
        const validationResult = await this.validationService.validateSignUpInput({
            username,
            password,
        });

        if (validationResult.errors && validationResult.errors.length > 0) {
            return validationResult;
        }

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

    @Mutation(() => Boolean)
    async signOut(@Ctx() ctx: MyContext): Promise<boolean> {
        return await new Promise(
            (resolve) =>
                ctx.req.session?.destroy((err) => {
                    if (err) {
                        console.error(err);
                        resolve(false);
                        return;
                    }

                    ctx.res.clearCookie(COOKIE_NAME);
                    resolve(true);
                }),
        );
    }
}
