import { ObjectType } from 'type-graphql';

import { BaseError } from './base-error';

@ObjectType()
export class AuthenticationError extends BaseError {}
