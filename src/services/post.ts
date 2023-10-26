import { Inject, Service } from 'typedi';

import { Post } from '../entities/Post';
import { PostRepository } from '../repositories';

@Service()
export class PostService {
    @Inject()
    private readonly postRepository!: PostRepository;

    async getAll(): Promise<Post[]> {
        return this.postRepository.find({});
    }
}
