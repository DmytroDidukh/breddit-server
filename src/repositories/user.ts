import { BaseRepository } from './base';

import { User } from '../entities';

export class UserRepository extends BaseRepository<User> {
    name: string = 'User';
}
