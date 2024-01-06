import { IsString, MinLength, ValidateIf } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePostInput {
    @Field(() => String, { nullable: true })
    @ValidateIf((o) => o.title !== undefined)
    @IsString({ message: 'Title must be a string.' })
    @MinLength(1, { message: 'Title cannot be empty' })
    title?: string;

    @Field(() => String, { nullable: true })
    @ValidateIf((o) => o.content !== undefined)
    @IsString({ message: 'Content must be a string.' })
    @MinLength(1, { message: 'Content cannot be empty' })
    content?: string;
}
