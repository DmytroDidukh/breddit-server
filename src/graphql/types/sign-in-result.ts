import { Field, ObjectType } from 'type-graphql';

import { AuthenticationError } from './errors';

import { User } from '../../entities';

@ObjectType()
export class SignInResult {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [AuthenticationError], { nullable: true })
    errors?: AuthenticationError[];
}
