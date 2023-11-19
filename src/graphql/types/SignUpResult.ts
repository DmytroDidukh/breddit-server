import { Field, ObjectType } from 'type-graphql';

import { FieldError } from './FieldError';

import { User } from '../../entities';

@ObjectType()
export class SignUpResult {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
