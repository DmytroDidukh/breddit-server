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

    async create(username: string, hashedPassword: string, email: string): Promise<User> {
        return this.userRepository.createAndSave(
            { username, password: hashedPassword, email },
            this.em,
        );
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

    update(id: number, data: Partial<User>): Promise<User> {
        return this.userRepository.updateAndSave(id, data, this.em);
    }

    delete(id: number): Promise<boolean> {
        return this.userRepository.deleteAndSave(id, this.em);
    }
}
