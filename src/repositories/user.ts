import { EntityRepository } from '@mikro-orm/core';

import { User } from '../entities';

export class UserRepository extends EntityRepository<User> {}
