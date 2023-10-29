import argon2 from 'argon2';
import { Inject, Service } from 'typedi';

import { UserService } from './user';

import { User } from '../entities';

@Service()
export class AuthService {
    @Inject()
    private readonly userService!: UserService;

    async registerUser(username: string, password: string): Promise<User> {
        const user = await this.userService.getOneByUsername(username);

        if (user) {
            throw new Error('User already exists');
        }

        const hashedPassword = await this.hashPassword(password);

        return await this.userService.create(username, hashedPassword);
    }

    private async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    // private async verifyPassword(password: string, hash: string): Promise<boolean> {
    //     return await argon2.verify(hash, password);
    // }
}
