import { Field, ObjectType } from 'type-graphql';

import { User } from '../../entities';
import { FieldError } from '../types/errors';

@ObjectType()
export class ChangePasswordResult {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
