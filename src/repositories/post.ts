import { BaseRepository } from './base';

import { Post } from '../entities';

export class PostRepository extends BaseRepository<Post> {
    name: string = 'Post';
}
