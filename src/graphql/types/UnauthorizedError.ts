import { ObjectType } from 'type-graphql';

import { BaseError } from './BaseError';

@ObjectType()
export class UnauthorizedError extends BaseError {}
