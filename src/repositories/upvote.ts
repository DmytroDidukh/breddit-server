import { EntityRepository } from '@mikro-orm/core';

import { Upvote } from '../entities';

export class UpvoteRepository extends EntityRepository<Upvote> {}
