import { validate, ValidationError } from 'class-validator';
import { Service } from 'typedi';

import { SignUpInput } from '../graphql/inputs';
import { FieldError, SignUpResult } from '../graphql/types';

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
