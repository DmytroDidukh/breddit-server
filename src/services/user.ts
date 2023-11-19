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
}
