import { IsString, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePostInput {
    @Field()
    @IsString({ message: 'Title must be a string.' })
    @MinLength(1, { message: 'Title cannot be empty' })
    title!: string;

    @Field()
    @IsString({ message: 'Content must be a string.' })
    @MinLength(1, { message: 'Content cannot be empty' })
    content!: string;
}
