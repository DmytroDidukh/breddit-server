import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from './base-entity';

import { UserRepository } from '../repositories';

@ObjectType()
@Entity({ customRepository: () => UserRepository })
export class User extends BaseEntity {
    @Field()
    @Property({ type: 'text', unique: true })
    username!: string;

    @Property({ type: 'text' })
    password!: string;

    @Field()
    @Property({ type: 'text', unique: true })
    email!: string;
}
