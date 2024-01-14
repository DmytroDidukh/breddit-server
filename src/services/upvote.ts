import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Inject, Service } from 'typedi';

import { PostService } from './post';

import { Upvote } from '../entities';

@Service()
export class UpvoteService {
    @Inject()
    private readonly postService!: PostService;

    @Inject()
    private readonly em!: SqlEntityManager;

    async vote(value: number, userId: number, postId: number): Promise<boolean> {
        const isUpvote = value !== -1;
        const insertValue = isUpvote ? 1 : -1;

        await this.em.upsert(Upvote, {
            value: insertValue,
            userId,
            postId,
        });
        await this.postService.updatePoints(postId, insertValue);

        return true;
    }
}
