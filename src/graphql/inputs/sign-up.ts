import { IsEmail, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class SignUpInput {
    @Field()
    @IsString({ message: 'Username must be a string.' })
    // @Length(2, 50, { message: 'Username must be at least 2 characters long.' })
    // @Matches(/^(?:(?![_.]{2})[a-zA-Z0-9._]){2,}$/, {
    //     message:
    //         // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    //         'Username can only contain letters, numbers, dots, or underscores. If only two characters are provided, they must be letters.',
    // })
    // @Matches(/^(?!.*[_.]{2})[^_.].*[^_.]$/, {
    //     message:
    //         // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    //         'Username must not start or end with a dot or an underscore, and cannot have two of these characters consecutively.',
    // })
    username!: string;

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
    @IsEmail()
    email!: string;
}
