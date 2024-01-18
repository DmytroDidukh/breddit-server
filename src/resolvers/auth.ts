import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { COOKIE_NAME } from '../constants';
import { MyContext } from '../context';
import { User } from '../entities';
import { ChangePasswordInput, SignInInput, SignUpInput } from '../graphql/inputs';
import { ChangePasswordResult, SignUpResult } from '../graphql/results';
import { AuthenticationMiddleware } from '../middlewares';
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
        @Arg('user') { username, password, email }: SignUpInput,
        @Ctx() ctx: MyContext,
    ): Promise<SignUpResult> {
        console.log('signUp');
        const validationResult = await this.validationService.validateInput<SignUpInput>(
            SignUpInput,
            {
                username,
                password,
                email,
            },
        );

        if (validationResult) {
            return {
                errors: validationResult,
            };
        }

        const result = await this.authService.signUp(username, password, email);

        // Store the user's ID in the session.
        ctx.req.session!.userId = result.user?.id;

        return result;
    }

    @Mutation(() => User)
    async signIn(
        @Arg('user') { username, password }: SignInInput,
        @Ctx() ctx: MyContext,
    ): Promise<User> {
        const user = await this.authService.signIn(username, password);

        // Store the user's ID in the session.
        ctx.req.session!.userId = user?.id;

        return user;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AuthenticationMiddleware)
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

    @Mutation(() => Boolean)
    async forgotPassword(@Arg('email') email: string): Promise<boolean> {
        return await this.authService.forgotPassword(email);
    }

    @Mutation(() => ChangePasswordResult)
    async changePassword(
        @Arg('options') { password, token }: ChangePasswordInput,
        @Ctx() ctx: MyContext,
    ): Promise<ChangePasswordResult> {
        const validationResult = await this.validationService.validateInput<ChangePasswordInput>(
            ChangePasswordInput,
            {
                password,
                token,
            },
        );

        if (validationResult) {
            return {
                errors: validationResult,
            };
        }

        const result = await this.authService.changePassword(password, token);

        // Store the user's ID in the session.
        ctx.req.session!.userId = result.user?.id;

        return result;
    }
}
