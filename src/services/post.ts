import { EntityManager, wrap } from '@mikro-orm/core';
import { Inject, Service } from 'typedi';

import { UserService } from './user';

import { Post } from '../entities';
import { CreatePostResult, UpdatePostResult } from '../graphql/results';
import { NotFoundError } from '../graphql/types';
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

    async create(title: string, content: string, authorId: number): Promise<CreatePostResult> {
        const author = await this.userService.getOneById(authorId);

        if (!author) {
            throw new NotFoundError('User', authorId);
        }

        const post = this.postRepository.create({ title, content, author });
        await this.em.persistAndFlush(post);

        return { post };
    }

    async update(id: number, title?: string, content?: string): Promise<UpdatePostResult> {
        const post = await this.getOneById(id);

        if (!post) {
            throw new NotFoundError('Post', id);
        }

        const updateData: Partial<Post> = {};
        if (title !== undefined) {
            updateData.title = title;
        }
        if (content !== undefined) {
            updateData.content = content;
        }

        const updatedPost = wrap(post).assign(updateData, { mergeObjects: true });
        await this.em.persistAndFlush(updatedPost);

        return { post: updatedPost };
    }

    async delete(id: number): Promise<boolean> {
        const post = await this.getOneById(id);

        if (!post) {
            throw new NotFoundError('Post', id);
        }

        await this.em.remove(post).flush();

        return true;
    }
}
