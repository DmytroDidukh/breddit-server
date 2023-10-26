import { EntityManager } from '@mikro-orm/core';
import { Inject, Service } from 'typedi';

import { Post } from '../entities/Post';
import { PostRepository } from '../repositories';

@Service()
export class PostService {
    @Inject()
    private readonly postRepository!: PostRepository;

    @Inject()
    private readonly em!: EntityManager;

    async getAll(): Promise<Post[]> {
        return this.postRepository.find({});
    }

    async getOneById(id: number): Promise<Post | null> {
        return this.postRepository.findOne({ id });
    }

    async create(title: string): Promise<Post> {
        const post = this.postRepository.create({ title });
        await this.em.persistAndFlush(post);

        return post;
    }
}
