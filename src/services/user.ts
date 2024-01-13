import { FindOneOrFailOptions } from '@mikro-orm/core';
import { Inject, Service } from 'typedi';

import { User } from '../entities';
import { AuthorizationError } from '../graphql/types';
import { UserRepository } from '../repositories';

@Service()
export class UserService {
    @Inject()
    private readonly userRepository!: UserRepository;

    getAll(): Promise<User[]> {
        return this.userRepository.find({});
    }

    create(username: string, hashedPassword: string, email: string): Promise<User> {
        return this.userRepository.createAndSave({ username, password: hashedPassword, email });
    }

    findOneByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ username });
    }

    findOneById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ id });
    }

    findOneByIdOrFail(id: number, options?: FindOneOrFailOptions<User>): Promise<User> {
        return this.userRepository.findOneByIdOrFail(id, options);
    }

    findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ email });
    }

    update(id: number, data: Partial<User>): Promise<User> {
        return this.userRepository.updateAndSave(id, data);
    }

    delete(id: number, userId: number): Promise<boolean> {
        if (id !== userId) {
            throw new AuthorizationError('You have no permission to delete this user.');
        }

        return this.userRepository.deleteAndSave(id);
    }
}
