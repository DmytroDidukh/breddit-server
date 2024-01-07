import { QueryOrder } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Inject, Service } from 'typedi';

import { UserService } from './user';

import { Post } from '../entities';
import { CreatePostInput, UpdatePostInput } from '../graphql/inputs';
import { CreatePostResult, UpdatePostResult } from '../graphql/results';
import { AuthorizationError } from '../graphql/types';
import { PostRepository } from '../repositories';

@Service()
export class PostService {
    @Inject()
    private readonly postRepository!: PostRepository;

    @Inject()
    private readonly userService!: UserService;

    @Inject()
    private readonly em!: SqlEntityManager;

    async getAll(cursor: Date | null, limit?: number): Promise<Post[]> {
        const maxLimit = this.ensureMaxLimit(limit);
        return this.em
            .createQueryBuilder(Post, 'p')
            .orderBy({ 'p.createdAt': QueryOrder.DESC })
            .where(cursor ? { createdAt: { $lt: cursor } } : {})
            .limit(maxLimit)
            .getResultList();
    }

    async findOneById(id: number): Promise<Post | null> {
        return this.postRepository.findOne({ id });
    }

    async create(postInput: CreatePostInput, authorId: number): Promise<CreatePostResult> {
        const author = await this.userService.findOneByIdOrFail(authorId);

        const post = await this.postRepository.createAndSave({ ...postInput, author }, this.em);

        return { post };
    }

    async update(
        id: number,
        postInput: UpdatePostInput,
        userId: number,
    ): Promise<UpdatePostResult> {
        const post = await this.postRepository.findOneByIdOrFail(id);

        if (post.author.id !== userId) {
            throw new AuthorizationError('You have no permission to update this post.');
        }

        const updateData: Partial<Post> = {};
        if (postInput.title !== undefined) {
            updateData.title = postInput.title;
        }
        if (postInput.content !== undefined) {
            updateData.content = postInput.content;
        }

        const updatedPost = await this.postRepository.updateAndSave(id, updateData, this.em);

        return { post: updatedPost };
    }

    async delete(id: number, userId: number): Promise<boolean> {
        const post = await this.postRepository.findOneByIdOrFail(id);

        if (post.author.id !== userId) {
            throw new AuthorizationError('You have no permission to delete this post.');
        }

        return this.postRepository.deleteAndSave(id, this.em);
    }

    getPostsByAuthor(authorId: number, cursor: Date | null, limit?: number): Promise<Post[]> {
        const maxLimit = this.ensureMaxLimit(limit);
        return this.em
            .createQueryBuilder(Post, 'p')
            .where({ author: { id: authorId } })
            .orderBy({ 'p.createdAt': QueryOrder.DESC })
            .andWhere(cursor ? { createdAt: { $lt: cursor } } : {})
            .limit(maxLimit)
            .getResultList();
    }

    private ensureMaxLimit(limit: number = 25) {
        return Math.min(50, limit);
    }
}
