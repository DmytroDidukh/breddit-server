import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

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
    signIn(@Arg('user') { username, password }: SignInInput): Promise<SignInResponse> {
        return this.authService.signIn(username, password);
    }
}
