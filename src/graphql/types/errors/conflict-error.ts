import { GraphQLError } from 'graphql/error';
import { ObjectType } from 'type-graphql';

import { ErrorCode } from '../../../consts';

@ObjectType()
export class ConflictError extends GraphQLError {
    constructor(message?: string) {
        const _message = message || 'Unauthorized';
        super(_message, { extensions: { code: ErrorCode.CONFLICT } });
    }
}
