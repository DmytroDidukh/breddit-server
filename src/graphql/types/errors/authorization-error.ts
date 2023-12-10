import { GraphQLError } from 'graphql/error';
import { ObjectType } from 'type-graphql';

import { ErrorCode } from '../../../consts';

@ObjectType()
export class AuthorizationError extends GraphQLError {
    constructor(message?: string) {
        const _message = message || 'Unauthorized';
        super(_message, { extensions: { code: ErrorCode.UNAUTHORIZED } });
    }
}
