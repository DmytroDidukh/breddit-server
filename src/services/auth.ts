import argon2 from 'argon2';
import { Service } from 'typedi';

@Service()
export class AuthService {
    async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}
