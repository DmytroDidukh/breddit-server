import { GraphQLError } from 'graphql/error';
import { ObjectType } from 'type-graphql';

import { ErrorCode } from '../../../consts';

@ObjectType()
export class NotFoundError extends GraphQLError {
    constructor(entity: string, identifier: string | number, message?: string) {
        const _message = message || NotFoundError.formatMessage(entity, identifier);
        super(_message, { extensions: { code: ErrorCode.NOT_FOUND } });
    }

    static formatMessage(entity: string, identifier: string | number): string {
        return `The ${entity} with the specified ID ${identifier} was not found.`;
    }
}
