import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Inject, Service } from 'typedi';

import { Post, User } from '../entities';
import { AuthorizationError } from '../graphql/types';
import { UserRepository } from '../repositories';

@Service()
export class UserService {
    @Inject()
    private readonly userRepository!: UserRepository;

    @Inject()
    private readonly em!: SqlEntityManager;

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

    delete(id: number, userId: number): Promise<boolean> {
        if (id !== userId) {
            throw new AuthorizationError('You have no permission to delete this user.');
        }

        return this.userRepository.deleteAndSave(id, this.em);
    }

    async getMyPosts(userId: number): Promise<Post[]> {
        const user = await this.userRepository.getOneByIdOrFail(userId);

        await this.em.populate(user, ['posts']);

        return user.posts.getItems();
    }
}
