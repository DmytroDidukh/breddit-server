import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Post {
    @PrimaryKey()
    id!: number;

    @Property({ type: 'text' })
    title!: string;

    @Property({ type: 'date', default: 'now()' })
    createdAt?: Date;

    @Property({ type: 'date', default: 'now()', onUpdate: () => new Date() })
    updatedAt?: Date;
}
