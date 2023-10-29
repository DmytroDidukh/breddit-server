import { Arg, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { User } from '../entities';
import { AuthService } from '../services';

@InputType()
class UserInput {
    @Field()
    // TODO: Add validation
    username!: string;

    @Field()
    // TODO: Add validation
    password!: string;
}

@Service()
@Resolver()
export class AuthResolver {
    @Inject()
    private readonly authService!: AuthService;

    @Mutation(() => User)
    registerUser(@Arg('user') { username, password }: UserInput): Promise<User> {
        return this.authService.registerUser(username, password);
    }
}
