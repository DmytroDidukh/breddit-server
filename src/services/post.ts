import { EntityManager } from '@mikro-orm/core';
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

    async create(postInput: CreatePostInput, authorId: number): Promise<CreatePostResult> {
        const author = await this.userService.getOneById(authorId);

        if (!author) {
            throw new NotFoundError('User', authorId);
        }

        const post = await this.postRepository.createAndSave({ ...postInput, author }, this.em);

        return { post };
    }

    async update(
        id: number,
        postInput: UpdatePostInput,
        userId: number,
    ): Promise<UpdatePostResult> {
        const post = await this.postRepository.getOneByIdOrFail(id);

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

    delete(id: number, userId: number): Promise<boolean> {
        if (id !== userId) {
            throw new AuthorizationError('You have no permission to delete this post.');
        }

        return this.postRepository.deleteAndSave(id, this.em);
    }
}
