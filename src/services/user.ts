import { EntityManager } from '@mikro-orm/core';
import { Inject, Service } from 'typedi';

import { User } from '../entities';
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

    async create(username: string, hashedPassword: string): Promise<User> {
        const user = this.userRepository.create({ username, password: hashedPassword });
        await this.em.persistAndFlush(user);

        return user;
    }

    async getOneByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne({ username });
    }

    async getOneById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ id });
    }

    async delete(id: number): Promise<boolean> {
        const user = await this.getOneById(id);

        if (!user) {
            // TODO: Handle NOT FOUND
            return false;
        }

        await this.userRepository.nativeDelete({ id });

        return true;
    }
}
