import { Field, ObjectType } from 'type-graphql';

import { User } from '../../entities';
import { AuthenticationError } from '../types';

@ObjectType()
export class SignInResult {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [AuthenticationError], { nullable: true })
    errors?: AuthenticationError[];
}
