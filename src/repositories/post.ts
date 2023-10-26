import { EntityRepository } from '@mikro-orm/core';

import { Post } from '../entities/Post';

export class PostRepository extends EntityRepository<Post> {}
