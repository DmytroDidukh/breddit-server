import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class BaseError extends Error {
    @Field()
    message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}
