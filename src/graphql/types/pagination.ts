import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PageInfo {
    @Field(() => String, { nullable: true })
    endCursor: string | null;

    @Field(() => String, { nullable: true })
    startCursor: string | null;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;
}
