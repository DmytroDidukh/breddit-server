import { validate, ValidationError } from 'class-validator';
import { Service } from 'typedi';

import { FieldError } from '../graphql/types';

@Service()
export class ValidationService {
    public async validateInput<T extends object>(
        Input: new () => T,
        input: T,
    ): Promise<FieldError[] | null> {
        const validationInput = new Input();
        Object.assign(validationInput, input);

        const errors = await validate(validationInput, { stopAtFirstError: true });

        if (errors.length > 0) {
            return this.formatValidationError(errors[0]);
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
