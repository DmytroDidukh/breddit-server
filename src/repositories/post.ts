import { EntityRepository } from '@mikro-orm/core';

import { Post } from '../entities';

export class PostRepository extends EntityRepository<Post> {}
