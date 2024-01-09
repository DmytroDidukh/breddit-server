import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PageInfo {
    @Field(() => String, { nullable: true })
    endCursor: Date | string | null;

    @Field(() => String, { nullable: true })
    startCursor: Date | string | null;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;
}
