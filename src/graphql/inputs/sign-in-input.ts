import { IsString, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class SignInInput {
    @Field()
    @IsString({ message: 'Username must be a string.' })
    @MinLength(1, { message: 'Username cannot be empty' })
    username!: string;

    @Field()
    @IsString({ message: 'Password must be a string.' })
    @MinLength(1, { message: 'Password cannot be empty' })
    password!: string;
}
