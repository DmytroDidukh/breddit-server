import {
    AnyEntity,
    Entity,
    BaseEntity as MikroOrmBaseEntity,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity({ abstract: true })
export abstract class BaseEntity extends MikroOrmBaseEntity<AnyEntity, number> {
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
