import { Field, ObjectType } from 'type-graphql';

import { BaseError } from './BaseError';

@ObjectType()
export class FieldError extends BaseError {
    @Field()
    field: string;

    constructor(field: string, message: string) {
        super(message);
        this.field = field;
    }
}
