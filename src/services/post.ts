import { EntityManager, wrap } from '@mikro-orm/core';
import { Inject, Service } from 'typedi';

import { UserService } from './user';

import { Post } from '../entities';
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

    async create(title: string, authorId: number): Promise<Post> {
        const author = await this.userService.getOneById(authorId);

        if (!author) {
            throw new NotFoundError('User', authorId);
        }

        const post = this.postRepository.create({ title, author });
        await this.em.persistAndFlush(post);

        return post;
    }

    async update(id: number, title: string): Promise<Post> {
        const post = await this.getOneById(id);

        if (!post) {
            throw new NotFoundError('Post', id);
        }

        const updatedPost = wrap(post).assign({ title }, { mergeObjects: true });
        await this.em.persistAndFlush(updatedPost);

        return updatedPost;
    }

    async delete(id: number): Promise<boolean> {
        const post = await this.getOneById(id);

        if (!post) {
            throw new NotFoundError('Post', id);
        }

        await this.postRepository.nativeDelete({ id });

        return true;
    }
}
