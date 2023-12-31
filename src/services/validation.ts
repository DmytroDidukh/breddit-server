import { validate, ValidationError } from 'class-validator';
import { Service } from 'typedi';

import {
    ChangePasswordInput,
    CreatePostInput,
    SignUpInput,
    UpdatePostInput,
} from '../graphql/inputs';
import { CreatePostResult, SignUpResult, UpdatePostResult } from '../graphql/results';
import { ChangePasswordResult } from '../graphql/results';
import { FieldError } from '../graphql/types';

@Service()
export class ValidationService {
    public async validateSignUpInput(input: SignUpInput): Promise<SignUpResult> {
        const validationInput = new SignUpInput();
        Object.assign(validationInput, input);

        const error = await this.validateInput(validationInput);

        if (error) {
            const formattedErrors = this.formatValidationError(error);
            return {
                errors: formattedErrors,
            };
        }

        return {};
    }

    public async validateChangePasswordInput(
        input: ChangePasswordInput,
    ): Promise<ChangePasswordResult> {
        const validationInput = new ChangePasswordInput();
        Object.assign(validationInput, input);

        const error = await this.validateInput(validationInput);

        if (error) {
            const formattedErrors = this.formatValidationError(error);
            return {
                errors: formattedErrors,
            };
        }

        return {};
    }

    public async validateCreatePostInput(input: CreatePostInput): Promise<CreatePostResult> {
        const validationInput = new CreatePostInput();
        Object.assign(validationInput, input);

        const error = await this.validateInput(validationInput);

        if (error) {
            const formattedErrors = this.formatValidationError(error);
            return {
                errors: formattedErrors,
            };
        }

        return {};
    }

    public async validateUpdatePostInput(input: UpdatePostInput): Promise<UpdatePostResult> {
        const validationInput = new UpdatePostInput();
        Object.assign(validationInput, input);

        const error = await this.validateInput(validationInput);

        if (error) {
            const formattedErrors = this.formatValidationError(error);
            return {
                errors: formattedErrors,
            };
        }

        return {};
    }

    private async validateInput<T extends object>(input: T): Promise<ValidationError | null> {
        const errors = await validate(input, { stopAtFirstError: true });

        if (errors.length > 0) {
            return errors[0];
        }

        return null;
    }

    private formatValidationError(error: ValidationError): FieldError[] {
        if (error.constraints) {
            return Object.values(error.constraints).map(
                (message) => new FieldError(error.property, message),
            );
        }

        return [new FieldError(error.property, 'Validation failed')];
    }
}
