import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Inject, Service } from 'typedi';

import { User } from '../entities';
import { AuthorizationError } from '../graphql/types';
import { UserRepository } from '../repositories';

@Service()
export class UserService {
    @Inject()
    private readonly userRepository!: UserRepository;

    @Inject()
    private readonly em!: SqlEntityManager;

    getAll(): Promise<User[]> {
        return this.userRepository.find({});
    }

    create(username: string, hashedPassword: string, email: string): Promise<User> {
        return this.userRepository.createAndSave(
            { username, password: hashedPassword, email },
            this.em,
        );
    }

    getOneByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ username });
    }

    getOneById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ id });
    }

    getOneByIdOrFail(id: number): Promise<User> {
        return this.userRepository.getOneByIdOrFail(id);
    }

    getOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ email });
    }

    update(id: number, data: Partial<User>): Promise<User> {
        return this.userRepository.updateAndSave(id, data, this.em);
    }

    delete(id: number, userId: number): Promise<boolean> {
        if (id !== userId) {
            throw new AuthorizationError('You have no permission to delete this user.');
        }

        return this.userRepository.deleteAndSave(id, this.em);
    }
}
