import { EntityManager, wrap } from '@mikro-orm/core';
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

    async update(id: number, title: string): Promise<Post | null> {
        const post = await this.getOneById(id);
        console.log(post);
        if (!post) {
            // TODO: Handle NOT FOUND
            return null;
        }
        console.log('NEXT');
        const updatedPost = wrap(post).assign({ title }, { mergeObjects: true });
        await this.em.persistAndFlush(updatedPost);

        return updatedPost;
    }

    async delete(id: number): Promise<boolean> {
        const post = await this.getOneById(id);

        if (!post) {
            // TODO: Handle NOT FOUND
            return false;
        }
        console.log('NEXT');
        await this.postRepository.nativeDelete({ id });

        return true;
    }

    // private getReference(id: number): Post {
    //     return this.postRepository.getReference(id);
    // }
}
