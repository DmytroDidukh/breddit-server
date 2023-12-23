import argon2 from 'argon2';
import RedisStore from 'connect-redis';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';

import { MailerService } from './mailer';
import { UserService } from './user';

import { FORGET_PASSWORD_PREFIX } from '../constants';
import { AuthenticationError, FieldError, SignInResult, SignUpResult } from '../graphql/types';
import { ChangePasswordResult } from '../graphql/types/change-password-result';

@Service()
export class AuthService {
    @Inject()
    private readonly userService!: UserService;

    @Inject()
    private readonly redis!: RedisStore;

    async signUp(username: string, password: string, email: string): Promise<SignUpResult> {
        const user = await this.userService.getOneByUsername(username);
        if (user) {
            return {
                errors: [new FieldError('username', 'Username already taken')],
            };
        }

        const userByEmail = await this.userService.getOneByEmail(email);
        if (userByEmail) {
            return {
                errors: [new FieldError('email', 'Email already taken')],
            };
        }

        const hashedPassword = await this.hashPassword(password);

        return { user: await this.userService.create(username, hashedPassword, email) };
    }

    async signIn(username: string, password: string): Promise<SignInResult> {
        const user = await this.userService.getOneByUsername(username);

        if (!user) {
            return {
                errors: [new AuthenticationError('Invalid username or password')],
            };
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return {
                errors: [new AuthenticationError('Invalid username or password')],
            };
        }

        return { user };
    }

    async forgotPassword(email: string): Promise<boolean> {
        const user = await this.userService.getOneByEmail(email);

        if (!user) {
            return true;
        }

        const token = this.createToken();
        await this.redis.set(FORGET_PASSWORD_PREFIX + token, user.id);

        const html = this.createForgotPasswordHtml(token);
        await MailerService.sendEmail(email, html);

        return true;
    }

    async changePassword(password: string, token: string): Promise<ChangePasswordResult> {
        const userId: number = await new Promise((resolve, reject) => {
            this.redis.get(FORGET_PASSWORD_PREFIX + token, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(null);
                } else {
                    resolve(result);
                }
            });
        });

        if (!userId) {
            return {
                errors: [new FieldError('token', 'Token expired')],
            };
        }

        const user = await this.userService.getOneById(userId);
        const hashedPassword = await this.hashPassword(password);

        return {
            user: await this.userService.update(user!.id, { password: hashedPassword }),
        };
    }

    private createForgotPasswordHtml(token: string): string {
        return `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`;
    }

    private createToken(): string {
        return v4();
    }

    private async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    private async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}
