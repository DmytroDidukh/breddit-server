import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLFormattedError } from 'graphql';

import { ErrorCode } from '../consts';
import { CombinedErrorCode } from '../types';

type FormattedError = Omit<GraphQLFormattedError, 'locations'> & { code: CombinedErrorCode };

export class ErrorHandlerService {
    public handleErrors(formattedError: GraphQLFormattedError): FormattedError {
        return {
            code: ErrorHandlerService.extractCode(formattedError),
            message: formattedError.message,
            path: formattedError.path,
            extensions: ErrorHandlerService.formatExtensions(formattedError.extensions),
        };
    }

    static extractCode(formattedError: GraphQLFormattedError): CombinedErrorCode {
        const code = formattedError.extensions?.code as CombinedErrorCode;

        if (ErrorHandlerService.isErrorCode(code)) {
            return code;
        } else if (ErrorHandlerService.isApolloServerErrorCode(code)) {
            return code;
        } else {
            return ErrorCode.UNKNOWN_ERROR;
        }
    }

    static isErrorCode(code: CombinedErrorCode): boolean {
        return Object.values(ErrorCode).includes(code as ErrorCode);
    }

    static isApolloServerErrorCode(code: CombinedErrorCode): boolean {
        return Object.values(ApolloServerErrorCode).includes(code as ApolloServerErrorCode);
    }

    static formatExtensions(
        extensions: Record<string, unknown> | undefined,
    ): Record<string, unknown> {
        const _extensions = { ...extensions };
        delete _extensions.code;
        return _extensions;
    }
}
