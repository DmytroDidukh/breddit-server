import { PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export abstract class BaseEntity {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: 'date', onCreate: () => new Date() })
    createdAt?: Date;

    @Field()
    @Property({ type: 'date', onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt?: Date;
}
