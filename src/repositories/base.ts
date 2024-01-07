import {
    EntityData,
    EntityManager,
    EntityRepository,
    FilterQuery,
    FindOneOrFailOptions,
    RequiredEntityData,
    wrap,
} from '@mikro-orm/core';

import { BaseEntity } from '../entities';
import { NotFoundError } from '../graphql/types';

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
    name: string = '';

    public async findOneByIdOrFail(id: number, options?: FindOneOrFailOptions<T>): Promise<T> {
        try {
            return await this.findOneOrFail({ id } as FilterQuery<T>, options);
        } catch (e) {
            throw new NotFoundError(this.name, id);
        }
    }

    public async createAndSave(data: RequiredEntityData<T>, em: EntityManager): Promise<T> {
        const entity = this.create(data);
        await em.persistAndFlush(entity);

        return entity;
    }

    public async updateAndSave(id: number, data: EntityData<T>, em: EntityManager): Promise<T> {
        const entity = await this.findOneByIdOrFail(id);

        const updatedEntity = wrap(entity).assign(data, { mergeObjects: true });
        await em.persistAndFlush(updatedEntity);

        return updatedEntity;
    }

    public async deleteAndSave(id: number, em: EntityManager): Promise<boolean> {
        const entity = await this.findOneByIdOrFail(id);

        await em.removeAndFlush(entity);

        return true;
    }
}
