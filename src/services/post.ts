import { QueryOrder } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Inject, Service } from 'typedi';

import { UserService } from './user';

import { Post } from '../entities';
import { CreatePostInput, UpdatePostInput } from '../graphql/inputs';
import { CreatePostResult, PostsResult, UpdatePostResult } from '../graphql/results';
import { AuthorizationError, PageInfo } from '../graphql/types';
import { PostRepository } from '../repositories';

@Service()
export class PostService {
    @Inject()
    private readonly postRepository!: PostRepository;

    @Inject()
    private readonly userService!: UserService;

    @Inject()
    private readonly em!: SqlEntityManager;

    async getAll(limit: number, cursor: Date | null): Promise<PostsResult> {
        const maxLimit = this.ensureMaxLimit(limit);

        const posts = await this.em
            .createQueryBuilder(Post, 'p')
            .orderBy({ 'p.createdAt': QueryOrder.DESC })
            .where(cursor ? { createdAt: { $lt: cursor } } : {})
            .limit(maxLimit + 1) // Fetch one extra record to determine if there's a next page
            .leftJoinAndSelect('p.author', 'a')
            .getResultList();

        const pageInfo = this.buildPageInfo(posts, maxLimit, cursor);

        return {
            items: posts,
            pageInfo,
        };
    }

    async findOneById(id: number): Promise<Post | null> {
        return this.postRepository.findOne({ id });
    }

    async create(postInput: CreatePostInput, authorId: number): Promise<CreatePostResult> {
        const author = await this.userService.findOneByIdOrFail(authorId);

        const post = await this.postRepository.createAndSave({ ...postInput, author });

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

        const updatedPost = await this.postRepository.updateAndSave(id, updateData);

        return { post: updatedPost };
    }

    async delete(id: number, userId: number): Promise<boolean> {
        const post = await this.postRepository.findOneByIdOrFail(id);

        if (post.author.id !== userId) {
            throw new AuthorizationError('You have no permission to delete this post.');
        }

        return this.postRepository.deleteAndSave(id);
    }

    async getPostsByAuthor(
        authorId: number,
        limit: number,
        cursor: Date | null,
    ): Promise<PostsResult> {
        const maxLimit = this.ensureMaxLimit(limit);
        const posts = await this.em
            .createQueryBuilder(Post, 'p')
            .where({ author: { id: authorId } })
            .orderBy({ 'p.createdAt': QueryOrder.DESC })
            .andWhere(cursor ? { createdAt: { $lt: cursor } } : {})
            .limit(maxLimit + 1)
            .leftJoinAndSelect('p.author', 'a')
            .getResultList();

        const pageInfo = this.buildPageInfo(posts, maxLimit, cursor);

        return {
            items: posts,
            pageInfo,
        };
    }

    private ensureMaxLimit(limit: number) {
        return Math.min(50, limit);
    }

    private buildPageInfo(posts: Post[], limit: number, cursor: Date | null): PageInfo {
        const hasNextPage = posts.length > limit;

        if (hasNextPage) {
            posts.pop();
        }

        const lastPost = posts[posts.length - 1];
        return {
            startCursor: null,
            endCursor: hasNextPage && lastPost.createdAt ? lastPost.createdAt.toISOString() : null,
            hasNextPage,
            hasPreviousPage: !!cursor,
        };
    }
}
