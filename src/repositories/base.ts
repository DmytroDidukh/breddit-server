import {
    EntityData,
    EntityManager,
    EntityRepository,
    FilterQuery,
    RequiredEntityData,
    wrap,
} from '@mikro-orm/core';

import { BaseEntity } from '../entities';
import { NotFoundError } from '../graphql/types';

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
    name: string = '';

    public async getOneByIdOrFail(id: number): Promise<T> {
        const entity = await this.findOne({ id } as FilterQuery<T>);

        if (!entity) {
            throw new NotFoundError(this.name, id);
        }

        return entity;
    }

    public async createAndSave(data: RequiredEntityData<T>, em: EntityManager): Promise<T> {
        const entity = this.create(data);
        await em.persistAndFlush(entity);

        return entity;
    }

    public async updateAndSave(id: number, data: EntityData<T>, em: EntityManager): Promise<T> {
        const entity = await this.getOneByIdOrFail(id);

        const updatedEntity = wrap(entity).assign(data, { mergeObjects: true });
        await em.persistAndFlush(updatedEntity);

        return updatedEntity;
    }

    public async deleteAndSave(id: number, em: EntityManager): Promise<boolean> {
        const entity = await this.getOneByIdOrFail(id);

        await em.remove(entity).flush();

        return true;
    }
}
