import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { SignInInput, SignUpInput } from '../graphql/inputs';
import { AuthResponse } from '../graphql/types';
import { AuthService } from '../services';

@Service()
@Resolver()
export class AuthResolver {
    @Inject()
    private readonly authService!: AuthService;

    @Mutation(() => AuthResponse)
    signUp(@Arg('user') { username, password }: SignUpInput): Promise<AuthResponse> {
        return this.authService.signUp(username, password);
    }

    @Mutation(() => AuthResponse)
    signIn(@Arg('user') { username, password }: SignInInput): Promise<AuthResponse> {
        return this.authService.signIn(username, password);
    }
}
