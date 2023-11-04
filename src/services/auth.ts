import argon2 from 'argon2';
import { Inject, Service } from 'typedi';

import { UserService } from './user';

import { AuthResponse, FieldError } from '../graphql/types';

@Service()
export class AuthService {
    @Inject()
    private readonly userService!: UserService;

    async signUp(username: string, password: string): Promise<AuthResponse> {
        const user = await this.userService.getOneByUsername(username);

        if (user) {
            return {
                errors: [new FieldError('username', 'Username already exists')],
            };
        }

        const hashedPassword = await this.hashPassword(password);

        return { user: await this.userService.create(username, hashedPassword) };
    }

    async signIn(username: string, password: string): Promise<AuthResponse> {
        const user = await this.userService.getOneByUsername(username);

        if (!user) {
            return {
                errors: [new FieldError('username', 'Invalid credentials')],
            };
        }

        const isPasswordMatch = await this.verifyPassword(password, user.password);

        if (!isPasswordMatch) {
            return {
                errors: [new FieldError('password', 'Invalid credentials')],
            };
        }

        return { user };
    }

    private async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    private async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}
