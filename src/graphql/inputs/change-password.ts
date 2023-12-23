import { IsString, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ChangePasswordInput {
    @Field()
    @IsString({ message: 'Password must be a string.' })
    // @Length(8, 36, { message: 'Password must be at least 8 characters long.' })
    // @Matches(/^(?=.*[a-z])/, { message: 'Password must contain at least one lowercase character.' })
    // @Matches(/^(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase character.' })
    // @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number.' })
    // @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    //     message: 'Password must contain at least one special character.',
    // })
    // @Matches(/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]*$/, {
    //     message: 'Password must only contain English letters, numbers, and special characters.',
    // })
    password!: string;

    @Field()
    @IsString({ message: 'Token must be a string.' })
    @MinLength(1, { message: 'Token cannot be empty' })
    token!: string;
}
