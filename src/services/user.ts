import { EntityManager, wrap } from '@mikro-orm/core';
import { Inject, Service } from 'typedi';

import { User } from '../entities';
import { NotFoundError } from '../graphql/types';
import { UserRepository } from '../repositories';

@Service()
export class UserService {
    @Inject()
    private readonly userRepository!: UserRepository;

    @Inject()
    private readonly em!: EntityManager;

    async getAll(): Promise<User[]> {
        return this.userRepository.find({});
    }

    async create(username: string, hashedPassword: string, email: string): Promise<User> {
        const user = this.userRepository.create({ username, password: hashedPassword, email });
        await this.em.persistAndFlush(user);

        return user;
    }

    async getOneByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne({ username });
    }

    async getOneById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ id });
    }

    async getOneByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ email });
    }

    async update(id: number, data: Partial<User>): Promise<User> {
        const user = await this.getOneById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        const updatedUser = wrap(user).assign(data, { mergeObjects: true });
        await this.em.persistAndFlush(updatedUser);

        return updatedUser;
    }

    async delete(id: number): Promise<boolean> {
        const user = await this.getOneById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        await this.em.remove(user).flush();

        return true;
    }
}
