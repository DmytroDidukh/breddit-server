import { GraphQLFormattedError } from 'graphql';

import { ErrorCodes } from '../consts';

type FormattedError = {
    code: ErrorCodes;
    message: string;
};

export class ErrorHandlerService {
    public handleErrors(
        formattedError: GraphQLFormattedError,
    ): GraphQLFormattedError | FormattedError {
        switch (formattedError.extensions?.code) {
            case ErrorCodes.NOT_FOUND:
                return this.formatError(formattedError);
            default:
                return formattedError;
        }
    }

    private formatError(formattedError: GraphQLFormattedError): FormattedError {
        const code = formattedError.extensions?.code as ErrorCodes;
        return {
            code,
            message: formattedError.message,
        };
    }
}
