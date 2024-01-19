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

        let points: number;

        if (existingUpvote && existingUpvote.value === value) {
            throw new ConflictError('You already voted on this post');
        } else if (existingUpvote && existingUpvote.value !== value) {
            points = 2 * value;
        } else {
            points = value;
        }

        await this.upvoteRepository.executeInTransaction(async (em) => {
            await em.upsert(Upvote, {
                id: userId + postId,
                value,
                userId,
                postId,
            });

            await this.postService.updatePoints(postId, points);
        });

        return true;
    }
}
