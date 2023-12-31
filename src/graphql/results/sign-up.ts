import { Field, ObjectType } from 'type-graphql';

import { User } from '../../entities';
import { FieldError } from '../types';

@ObjectType()
export class SignUpResult {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
