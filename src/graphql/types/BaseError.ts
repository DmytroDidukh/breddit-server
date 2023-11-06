import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class BaseError {
    @Field()
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}
