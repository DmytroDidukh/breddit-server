import { Inject, Service } from 'typedi';

import { PostService } from './post';

import { Upvote } from '../entities';
import { ConflictError } from '../graphql/types';
import { UpvoteRepository } from '../repositories';

@Service()
export class UpvoteService {
    @Inject()
    private readonly postService!: PostService;

    @Inject()
    private readonly upvoteRepository!: UpvoteRepository;

    async vote(value: number, userId: number, postId: number): Promise<boolean> {
        const existingUpvote = await this.upvoteRepository.findOne({ userId, postId });

        if (existingUpvote) {
            throw new ConflictError('You already voted on this post');
        }

        const isUpvote = value !== -1;
        const insertValue = isUpvote ? 1 : -1;

        await this.upvoteRepository.executeInTransaction(async (em) => {
            await em.upsert(Upvote, {
                id: userId + postId,
                value: insertValue,
                userId,
                postId,
            });

            await this.postService.updatePoints(postId, insertValue);
        });

        return true;
    }
}
