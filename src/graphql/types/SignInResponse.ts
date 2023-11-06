import { Field, ObjectType } from 'type-graphql';

import { UnauthorizedError } from './UnauthorizedError';

import { User } from '../../entities';

@ObjectType()
export class SignInResponse {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [UnauthorizedError], { nullable: true })
    errors?: UnauthorizedError[];
}
