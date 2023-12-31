import { EntityManager, wrap } from '@mikro-orm/core';
import { Inject, Service } from 'typedi';

import { UserService } from './user';

import { Post } from '../entities';
import { CreatePostInput, UpdatePostInput } from '../graphql/inputs';
import { CreatePostResult, UpdatePostResult } from '../graphql/results';
import { AuthorizationError, NotFoundError } from '../graphql/types';
import { PostRepository } from '../repositories';

@Service()
export class PostService {
    @Inject()
    private readonly postRepository!: PostRepository;

    @Inject()
    private readonly userService!: UserService;

    @Inject()
    private readonly em!: EntityManager;

    async getAll(): Promise<Post[]> {
        return this.postRepository.find({});
    }

    async getOneById(id: number): Promise<Post | null> {
        return this.postRepository.findOne({ id });
    }

    async getOneByIdOrFail(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({ id });

        if (!post) {
            throw new NotFoundError('Post', id);
        }

        return post;
    }

    async create(postInput: CreatePostInput, authorId: number): Promise<CreatePostResult> {
        const author = await this.userService.getOneByIdOrFail(authorId);

        const post = this.postRepository.create({ ...postInput, author });
        await this.em.persistAndFlush(post);

        return { post };
    }

    async update(
        id: number,
        postInput: UpdatePostInput,
        userId: number,
    ): Promise<UpdatePostResult> {
        const post = await this.getOneByIdOrFail(id);

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

        const updatedPost = wrap(post).assign(updateData, { mergeObjects: true });
        await this.em.persistAndFlush(updatedPost);

        return { post: updatedPost };
    }

    async delete(id: number): Promise<boolean> {
        const post = await this.getOneByIdOrFail(id);

        await this.em.remove(post).flush();

        return true;
    }
}
