import { GraphQLError } from 'graphql/error';
import { ObjectType } from 'type-graphql';

import { ErrorCode } from '../../../consts';

@ObjectType()
export class AuthenticationError extends GraphQLError {
    constructor(message?: string) {
        const _message = message || 'Unauthenticated';
        super(_message, { extensions: { code: ErrorCode.UNAUTHENTICATED } });
    }
}
